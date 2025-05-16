package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
)

type AuthRequest struct {
	Method   string `json:"method"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Data struct {
		Token         string `json:"token"`
		ExpiresAt     string `json:"expiresAt"`
		IdentityId    string `json:"identityId"`
		IsMfaComplete bool   `json:"isMfaComplete"`
	} `json:"data"`
}

func loginToController(apiUrl, username, password string) (string, error) {
	loginUrl := fmt.Sprintf("%s/edge/client/v1/authenticate?method=password", apiUrl)

	reqBody := AuthRequest{
		Method:   "password",
		Username: username,
		Password: password,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	resp, err := http.Post(loginUrl, "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("login failed: %s", string(bodyBytes))
	}

	var authResp AuthResponse
	if err := json.NewDecoder(resp.Body).Decode(&authResp); err != nil {
		return "", err
	}

	fmt.Println(authResp)

	return authResp.Data.Token, nil
}

func main() {
	fmt.Println("Ziti event publisher starting...")

	// TODO: login to Ziti controller using username/password
	apiUrl := "" // ← CHANGE THIS
	username := "admin"
	password := ""

	token, err := loginToController(apiUrl, username, password)
	if err != nil {
		log.Fatalf("Login failed: %v", err)
	}

	fmt.Println("token ", token)

	// TODO: open WebSocket channel using identity

	// TODO: subscribe and stream events

	log.Println("Done.")
}
