import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from '@/components/theme-provider';
import { UserSession } from '@/components/user-session';
import { PlatformProvider } from "@/components/download/platform-provider";
import getHost from "@/lib/host";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>,
}): Promise<Metadata> => {
    const host = await getHost();

    const metadata = {
        title: `${host} — The easy service sharing platform"`,
        description: `${host} makes it easy to share private services with yourself and your friends over the internet.`,
    }
    return metadata;
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem>
                    <UserSession>
                        <PlatformProvider>
                            {children}
                        </PlatformProvider>
                    </UserSession>
                </ThemeProvider>
            </body>
        </html>
    );
}
