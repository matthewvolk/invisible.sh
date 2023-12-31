import { Inter } from "next/font/google";
import Link from "next/link";
import * as React from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/context/theme-provider";

import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Invisible.sh -  Self-destructing links made for sharing sensitive data",
  description:
    "Stop sharing plaintext passwords via email, Slack, and Discord. Send with Invisible instead.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <main className="relative mx-auto min-h-screen">
          <header className="sticky top-0 border-b bg-white/50 backdrop-blur-sm backdrop-saturate-200 dark:bg-black/50">
            <div className="container flex items-center justify-between px-4 py-3 md:p-4">
              <Link href="/" className="font-bold tracking-wide md:text-lg">
                Invisible.sh
              </Link>
              <ThemeToggle />
            </div>
          </header>
          {children}
          <footer className="mb-8 mt-24">
            <p className="text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()}, Invisible.sh
            </p>
          </footer>
        </main>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
