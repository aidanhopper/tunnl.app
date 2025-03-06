# tunnl.app

## Plan

1.  Create a service which can control the ziti-edge-tunnel. This service on
    startup or connection to the internet will try to connect to the server
    over a websocket. The server will then issue a private key to the daemon
    which it will use to sign the hardware ID. The signed HWID will then be
    available on a local only webserver that the browser can query. When the
    browser queries the web server it gets the signed HWID back. To send the
    HWID to the server it needs to be authenticated with the server. Once it
    has the API user token and the signed HWID it can then send it to the
    server to access the daemon associated with the HWID which the server
    is connected to over websocket.

2.  Rewrite the frontend to work in the browser instead of working in an electron
    app. Since the user will need to install a service anyway it will be easier
    to deploy the fontend in a webapp instead of having the user download an
    electron app.
