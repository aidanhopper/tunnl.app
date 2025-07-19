package main

import (
	"bufio"
	"bytes"
	"crypto/tls"
	"flag"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
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

type ServiceHandler struct {
	Stop   func()
	Config ServiceBindConfig
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

	for {
		zitiServices := getBindServices(ctx)
		services := transformZitiServices(zitiServices)
		listenToServices(ctx, services, handlers, tlsConfig)
		time.Sleep(1 * time.Second)
		ctx.RefreshServices()
	}
}

func listenToService(ctx ziti.Context, service ServiceBindConfig, tlsConfig *tls.Config) (func(), error) {
	options := ziti.ListenOptions{
		ConnectTimeout: 5 * time.Minute,
	}

	listener, err := ctx.ListenWithOptions(service.Name, &options)
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
				if err != nil {
					log.Printf("Accept error %v", err)
					return
				}
				go handleConnection(conn, service, tlsConfig)
			}
		}
	}

	go listen()

	stop := func() {
		close(stopChan)
		_ = listener.Close()
		log.Println("CLOSING LISTENER FOR", service.Name)
	}

	return stop, nil
}

func listenToServices(ctx ziti.Context, services map[string]ServiceBindConfig, handlers map[string]ServiceHandler, tlsConfig *tls.Config) {
	for name, handler := range handlers {
		if _, ok := services[name]; !ok {
			handler.Stop()
			delete(handlers, name)
		}
	}

	for _, service := range services {
		needToListen := true

		if handler, ok := handlers[service.Name]; ok {
			if handler.Config != service {
				handler.Stop()
			} else {
				needToListen = false
			}
		}

		if needToListen {
			stop, err := listenToService(ctx, service, tlsConfig)
			if err == nil {
				handlers[service.Name] = ServiceHandler{
					Config: service,
					Stop:   stop,
				}
			} else {
				log.Println(err)
			}
		}
	}
}

func transformZitiServices(services []rest_model.ServiceDetail) map[string]ServiceBindConfig {
	ret := make(map[string]ServiceBindConfig)
	for _, service := range services {
		value := transformZitiService(service)
		key := value.Name
		ret[key] = value
	}
	return ret
}

func transformZitiService(service rest_model.ServiceDetail) ServiceBindConfig {
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

func handleConnection(conn1 net.Conn, service ServiceBindConfig, tlsConfig *tls.Config) {
	defer conn1.Close()

	conn2, err := net.DialTimeout(service.Protocol, service.Address+":"+service.Port, 10*time.Second)
	if err != nil {
		return
	}

	forwardTraffic(conn1, conn2, tlsConfig)
}

func forwardTraffic(client, server net.Conn, tlsConfig *tls.Config) {
	defer client.Close()
	defer server.Close()

	tlsConn := tls.Server(client, tlsConfig)
	err := tlsConn.Handshake()
	if err != nil {
		log.Println("TLS handshake error:", err)
		client.Close()
		return
	}

	// Read and parse the HTTP request to get Host header
	reader := bufio.NewReader(tlsConn)
	req, err := http.ReadRequest(reader)
	if err != nil {
		log.Printf("Error reading HTTP request: %v", err)
		return
	}

	// Inspect the Host header
	sourceIdentity := getSourceIdentity(client)
	if !isValidRequest(sourceIdentity, req) {
		server.Close()
		client.Close()
		log.Printf("Invalid request")
		return
	}


	var requestBuffer bytes.Buffer
	req.Write(&requestBuffer)

	// Send the complete request to the backend server
	_, err = server.Write(requestBuffer.Bytes())
	if err != nil {
		return
	}

	// Forward data bidirectionally between TLS client and HTTP server
	go func() {
		defer server.Close()
		defer tlsConn.Close()
		io.Copy(server, tlsConn)
	}()

	// Forward data from server back to client
	_, err = io.Copy(tlsConn, server)
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

func isValidRequest(identityName string, req *http.Request) bool {
	return true
}
