package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"net"
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

	handlers := make(map[string]ServiceHandler)

	for {
		zitiServices := getBindServices(ctx)
		services := transformZitiServices(zitiServices)
		listenToServices(ctx, services, handlers)
		time.Sleep(1 * time.Second)
		ctx.RefreshServices()
	}
}

func listenToService(ctx ziti.Context, service ServiceBindConfig) (func(), error) {
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
				go handleConnection(conn, service)
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

func listenToServices(ctx ziti.Context, services map[string]ServiceBindConfig, handlers map[string]ServiceHandler) {
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
			stop, err := listenToService(ctx, service)
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

func handleConnection(conn1 net.Conn, service ServiceBindConfig) {
	defer conn1.Close()

	sourceIdentity := getSourceIdentity(conn1)
	fmt.Println(sourceIdentity)

	conn2, err := net.DialTimeout(service.Protocol, service.Address+":"+service.Port, 10*time.Second)
	if err != nil {
		return
	}
	defer conn2.Close()

	go forwardTraffic(conn1, conn2, true)
	forwardTraffic(conn2, conn1, false)
}

func forwardTraffic(src, dst net.Conn, termiateTLS bool) {
	defer func() {
		// Close the destination connection when forwarding is done
		dst.Close()
	}()

	buffer := make([]byte, 4096)
	for {
		n, err := src.Read(buffer)
		if err != nil {
			if err != io.EOF {
				log.Println("Error", err)
			}
			break
		}

		_, err = dst.Write(buffer[:n])
		if err != nil {
			log.Println("Error", err)
			break
		}
	}
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
