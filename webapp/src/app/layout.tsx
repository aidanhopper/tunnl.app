import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from '@/components/theme-provider';
import { UserSession } from '@/components/user-session';
import { PlatformProvider } from "@/components/download/platform-provider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Tunnl.app — The easy service sharing platform",
    description: "Tunnl.app makes it easy to share private services yourself and your friends over the internet.",
};

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
