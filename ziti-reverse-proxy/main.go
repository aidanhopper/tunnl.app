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
		zitiBinds := getBindServices(ctx)
		binds := transformZitiBinds(zitiBinds)
		listenToServices(ctx, binds, handlers, tlsConfig)
		time.Sleep(1 * time.Second)
		ctx.RefreshServices()
	}
}

func listenToService(ctx ziti.Context, bind ServiceBindConfig, tlsConfig *tls.Config) (func(), error) {
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
				go handleConnection(ctx, conn, tlsConfig)
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

func listenToServices(ctx ziti.Context, binds map[string]ServiceBindConfig, handlers map[string]ServiceHandler, tlsConfig *tls.Config) {
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
			stop, err := listenToService(ctx, bind, tlsConfig)
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

func handleConnection(ctx ziti.Context, client net.Conn, tlsConfig *tls.Config) {
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

	dial, err := getDialServiceName(getSourceIdentity(client), req)
	if err != nil {
		return
	}

	server, err := ctx.Dial(dial)
	if err != nil {
		log.Println("Error dialing service")
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
		return []rest_model.ServiceDetail{}
	}

	var ret []rest_model.ServiceDetail

	for _, service := range services {
		hasBindPermission := false

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
func getDialServiceName(identityName string, req *http.Request) (string, error) {
	return "portfolio-NTlOTyc2QETy", nil
}
