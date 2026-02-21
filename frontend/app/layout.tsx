import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FinGuard AI — Fraud Intelligence Platform",
  description: "Real-time AI-powered financial fraud detection and monitoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="app-body font-sans antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
