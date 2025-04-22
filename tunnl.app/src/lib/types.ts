export interface ForwardedPorts {
    forwardPorts: true
    ports: string
}

export interface ProxiedPorts {
    forwardPorts: false
    sourcePort: string
    accessPort: string
}

export interface Service {
    service: string
    device: string
    domain: string
    host: string
    ports: ProxiedPorts | ForwardedPorts
    publicShare: string | null
    created: string
}


