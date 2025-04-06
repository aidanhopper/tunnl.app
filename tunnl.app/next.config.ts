import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
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
                destination: 'https://tunnl.app',
                permanent: true,
            }
        ]
    }
};

export default nextConfig;
