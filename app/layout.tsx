import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Middle Way",
  description: "Find balance in your journey",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <main className="pb-safe min-h-screen">
            {children}
          </main>
          <MobileNavigation />
        </ThemeProvider>
      </body>
    </html>
  );
}
