import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your App Name",
  description: "A clean, minimal, Linear-inspired interface.",
  metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: "Your App Name",
    description: "A clean, minimal, Linear-inspired interface.",
    url: "https://yourdomain.com",
    siteName: "Your App Name",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          ${mono.variable}
          min-h-screen
          bg-background
          text-foreground
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
