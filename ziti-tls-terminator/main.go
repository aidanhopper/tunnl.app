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

	"github.com/openziti/sdk-golang/ziti"
)

type ZitiConnInfo struct {
	ConnID         uint32
	SvcID          string
	SourceIdentity string
}

func main() {
	forward_ := flag.String("forward-to", "", "The address to forward traffic to")
	identityPath_ := flag.String("identity-path", "", "The path of your enrolled identity file")

	flag.Parse()

	forward := *forward_
	identityPath := *identityPath_

	if forward == "" {
		log.Println("Error: --forward-to is required")
		flag.Usage()
		os.Exit(1)
	}

	if identityPath == "" {
		log.Println("Error: --identity-path is required")
		flag.Usage()
		os.Exit(1)
	}

	options := ziti.ListenOptions{
		ConnectTimeout: 5 * time.Minute,
		MaxConnections: 3,
	}

	ctx, err := ziti.NewContextFromFile(identityPath)
	if err != nil {
		panic(err)
	}

	serviceNames := getBindServices(ctx)
	if len(serviceNames) == 0 {
		log.Fatalf("No services to bind to")
	}

	fmt.Println(serviceNames[0])
	listener, err := ctx.ListenWithOptions(serviceNames[0], &options)
	if err != nil {
		fmt.Println("Error binding service")
		panic(err)
	}
	defer listener.Close()

	for {
		conn, err := listener.Accept()
		if err != nil {
			panic(err)
		}

		go handleConnection(conn, forward, serviceNames[0])
	}
}

func handleConnection(conn1 net.Conn, conn2Address, serviceName string) {
	defer conn1.Close()

	sourceIdentity := getSourceIdentity(conn1)
	fmt.Println(sourceIdentity)

	conn2, err := net.DialTimeout("tcp", conn2Address, 10*time.Second)
	if err != nil {
		panic(err)
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

func getBindServices(ctx ziti.Context) []string {
	services, err := ctx.GetServices()
	if err != nil {
		panic(err)
	}

	var ret []string

	for _, service := range services {
		hasBindPermission := false

		for _, perm := range service.Permissions {
			if perm == "Bind" {
				hasBindPermission = true
			}
		}

		if hasBindPermission {
			ret = append(ret, *service.Name)
		}
	}

	return ret
}
