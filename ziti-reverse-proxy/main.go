package main

import (
	"crypto/tls"
	"fmt"
	"io"

	"log"
	"net"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/openziti/edge-api/rest_model"
	"github.com/openziti/sdk-golang/ziti"
)

type ServiceBindConfig struct {
	Name    string
	Forward string
}

type ServiceHandler struct {
	Stop   func()
	Config ServiceBindConfig
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	identity := os.Getenv("IDENTITY")
	if identity == "" {
		fmt.Println("Must specify an identity")
		os.Exit(1)
	}

	cfg, err := ziti.NewConfigFromFile(identity)
	if err != nil {
		panic(err)
	}

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

	log.Println("Starting listeners")
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
				go handleConnection(ctx, conn, bind.Forward, tlsConfig)
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
			if handler.Config.Forward != bind.Forward {
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
	return ServiceBindConfig{
		Forward: strings.ReplaceAll(*service.Name, "-private-https", ""),
		Name:    *service.Name,
	}
}

func handleConnection(ctx ziti.Context, client net.Conn, dial string, tlsConfig *tls.Config) {
	log.Println("Handling connection")
	tlsConn := tls.Server(client, tlsConfig)
	err := tlsConn.Handshake()
	if err != nil {
		log.Println("TLS handshake error:", err)
		client.Close()
		return
	}

	server, err := ctx.Dial(dial)
	if err != nil {
		log.Println("Error dialing", dial, "service", err)
		tlsConn.Close()
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
