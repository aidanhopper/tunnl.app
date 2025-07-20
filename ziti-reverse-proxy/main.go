package main

import (
	"bufio"
	"crypto/tls"
	"flag"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/openziti/edge-api/rest_model"
	"github.com/openziti/sdk-golang/ziti"
)

type ServiceBindConfig struct {
	Name     string
	Address  string
	Port     string
	Protocol string
}

type ServiceDialConfig struct {
	Name    string
	Address string
	Port    string
}

type ServiceHandler struct {
	Stop   func()
	Config ServiceBindConfig
}

type SharedDials struct {
	mu    sync.RWMutex
	dials map[string]ServiceDialConfig
}

func (sd *SharedDials) Get(name string) (ServiceDialConfig, bool) {
	sd.mu.RLock()
	defer sd.mu.RUnlock()
	val, ok := sd.dials[name]
	return val, ok
}

func (sd *SharedDials) Update(newDials map[string]ServiceDialConfig) {
	sd.mu.RLock()
	// Check if the maps are equal
	same := len(sd.dials) == len(newDials)
	if same {
		for k, v := range newDials {
			old, ok := sd.dials[k]
			if !ok || old != v {
				same = false
				break
			}
		}
	}
	sd.mu.RUnlock()

	if same {
		return // no change, skip update
	}

	// Now do the actual update with a write lock
	sd.mu.Lock()
	defer sd.mu.Unlock()
	sd.dials = newDials
}

func main() {
	identityPath_ := flag.String("identity-path", "", "The path of your enrolled identity file")

	flag.Parse()

	identityPath := *identityPath_

	if identityPath == "" {
		log.Println("Error: --identity-path is required")
		flag.Usage()
		os.Exit(1)
	}

	cfg, err := ziti.NewConfigFromFile(identityPath)

	cfg.ConfigTypes = append(cfg.ConfigTypes, "all")

	ctx, err := ziti.NewContext(cfg)
	if err != nil {
		panic(err)
	}

	cert, err := tls.LoadX509KeyPair("./identities/cert.pem", "./identities/key.pem")
	if err != nil {
		panic(err)
	}
	tlsConfig := &tls.Config{Certificates: []tls.Certificate{cert}}

	handlers := make(map[string]ServiceHandler)

	sharedDials := &SharedDials{
		dials: make(map[string]ServiceDialConfig),
	}

	for {
		zitiBinds := getBindServices(ctx)
		zitiDials := getDialServices(ctx)
		binds := transformZitiBinds(zitiBinds)
		dials := transformZitiDials(zitiDials)
		sharedDials.Update(dials)
		listenToServices(ctx, binds, sharedDials, handlers, tlsConfig)
		time.Sleep(1 * time.Second)
		ctx.RefreshServices()
	}
}

func listenToService(ctx ziti.Context, bind ServiceBindConfig, sharedDials *SharedDials, tlsConfig *tls.Config) (func(), error) {
	options := ziti.ListenOptions{
		ConnectTimeout: 5 * time.Minute,
	}

	listener, err := ctx.ListenWithOptions(bind.Name, &options)
	if err != nil {
		return nil, err
	}

	stopChan := make(chan struct{})

	listen := func() {
		defer listener.Close()
		for {
			select {
			case <-stopChan:
				return
			default:
				conn, err := listener.Accept()
				defer conn.Close()
				if err != nil {
					log.Printf("Accept error %v", err)
					return
				}
				go handleConnection(ctx, conn, sharedDials, tlsConfig)
			}
		}
	}

	go listen()

	stop := func() {
		close(stopChan)
		_ = listener.Close()
	}

	return stop, nil
}

func listenToServices(ctx ziti.Context, binds map[string]ServiceBindConfig, sharedDials *SharedDials, handlers map[string]ServiceHandler, tlsConfig *tls.Config) {
	for name, handler := range handlers {
		if _, ok := binds[name]; !ok {
			handler.Stop()
			delete(handlers, name)
		}
	}

	for _, bind := range binds {
		needToListen := true

		if handler, ok := handlers[bind.Name]; ok {
			if handler.Config != bind {
				handler.Stop()
			} else {
				needToListen = false
			}
		}

		if needToListen {
			stop, err := listenToService(ctx, bind, sharedDials, tlsConfig)
			if err == nil {
				handlers[bind.Name] = ServiceHandler{
					Config: bind,
					Stop:   stop,
				}
			} else {
				log.Println(err)
			}
		}
	}
}

func transformZitiDials(services []rest_model.ServiceDetail) map[string]ServiceDialConfig {
	ret := make(map[string]ServiceDialConfig)
	for _, service := range services {
		value, err := transformZitiDial(service)
		if err == nil {
			key := value.Address
			ret[key] = value
		}
	}
	return ret
}

func transformZitiBinds(services []rest_model.ServiceDetail) map[string]ServiceBindConfig {
	ret := make(map[string]ServiceBindConfig)
	for _, service := range services {
		value := transformZitiBind(service)
		key := value.Name
		ret[key] = value
	}
	return ret
}

func transformZitiBind(service rest_model.ServiceDetail) ServiceBindConfig {
	zitiHostConfig := service.Config["host.v1"]

	protocol := zitiHostConfig["protocol"]
	if protocol == nil {
		protocol = "tcp"
	}

	port := fmt.Sprintf("%.0f", zitiHostConfig["port"])
	return ServiceBindConfig{
		Address:  zitiHostConfig["address"].(string),
		Port:     port,
		Protocol: protocol.(string),
		Name:     *service.Name,
	}
}

func transformZitiDial(service rest_model.ServiceDetail) (ServiceDialConfig, error) {
	zitiInterceptConfig := service.Config["intercept.v1"]

	address := ""
	if addresses := zitiInterceptConfig["addresses"]; addresses != nil {
		if arr := addresses.([]any); arr != nil {
			address = arr[0].(string)
		}
	}

	if address == "" {
		return ServiceDialConfig{}, fmt.Errorf("Dial service has no address")
	}

	var port float64
	port = -1
	if portRanges := zitiInterceptConfig["portRanges"]; portRanges != nil {
		port = portRanges.([]any)[0].(map[string]any)["high"].(float64)
	}

	if port == -1 {
		return ServiceDialConfig{}, fmt.Errorf("No port")
	}

	return ServiceDialConfig{
		Address: address,
		Port:    fmt.Sprintf("%.0f", port),
	}, nil
}

func handleConnection(ctx ziti.Context, client net.Conn, sharedDials *SharedDials, tlsConfig *tls.Config) {
	tlsConn := tls.Server(client, tlsConfig)
	err := tlsConn.Handshake()
	if err != nil {
		log.Println("TLS handshake error:", err)
		client.Close()
		return
	}

	reader := bufio.NewReader(tlsConn)
	req, err := http.ReadRequest(reader)
	if err != nil {
		log.Printf("Error reading HTTP request: %v", err)
		return
	}

	dial, ok := sharedDials.Get(req.Host)
	if !ok {
		return
	}

	fmt.Println(dial)

	sourceIdentity := getSourceIdentity(client)
	if !isValidRequest(sourceIdentity, req) {
		client.Close()
		log.Printf("Invalid request")
		return
	}

	// options := ziti.DialOptions{
	// 	ConnectTimeout: 5 * time.Minute,
	// }
	// ctx.DialWithOptions(, &options)

	// forwardTraffic(conn1, conn2, tlsConfig)
}

func forwardTraffic(client, server net.Conn, tlsConfig *tls.Config) {
	// Read and parse the HTTP request to get Host header

	// Inspect the Host header

	// var requestBuffer bytes.Buffer
	// req.Write(&requestBuffer)
	//
	// // Send the complete request to the backend server
	// _, err = server.Write(requestBuffer.Bytes())
	// if err != nil {
	// 	return
	// }
	//
	// // Forward data bidirectionally between TLS client and HTTP server
	// go func() {
	// 	defer server.Close()
	// 	defer tlsConn.Close()
	// 	io.Copy(server, tlsConn)
	// }()
	//
	// // Forward data from server back to client
	// _, err = io.Copy(tlsConn, server)
}

func getSourceIdentity(conn net.Conn) string {
	return strings.Split(strings.Split(conn.LocalAddr().String(), " ")[3], "=")[1]
}

func getBindServices(ctx ziti.Context) []rest_model.ServiceDetail {
	services, err := ctx.GetServices()
	if err != nil {
		panic(err)
	}

	var ret []rest_model.ServiceDetail

	for _, service := range services {
		hasBindPermission := false
		// fmt.Println(service.Configs)

		for _, perm := range service.Permissions {
			if perm == "Bind" {
				hasBindPermission = true
			}
		}

		if hasBindPermission {
			ret = append(ret, service)
		}
	}

	return ret
}

func getDialServices(ctx ziti.Context) []rest_model.ServiceDetail {
	services, err := ctx.GetServices()
	if err != nil {
		panic(err)
	}

	var ret []rest_model.ServiceDetail

	for _, service := range services {
		hasDialPermission := false
		// fmt.Println(service.Configs)

		for _, perm := range service.Permissions {
			if perm == "Dial" {
				hasDialPermission = true
			}
		}

		if hasDialPermission {
			ret = append(ret, service)
		}
	}

	return ret
}
func isValidRequest(identityName string, req *http.Request) bool {
	return true
}
