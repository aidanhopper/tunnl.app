import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    experimental: {
        authInterrupts: true,
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'www.tunnl.app',
                    },
                ],
                destination: 'https://tunnl.app/:path*',
                permanent: true,
            }
        ]
    }
};

export default nextConfig;
