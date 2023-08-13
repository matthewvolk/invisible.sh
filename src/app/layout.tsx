import { Inter } from "next/font/google";
import * as React from "react";

import { ThemeProvider } from "@/context/theme-provider";

import "./globals.css";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invisible.sh -  Self-destructing links for sharing sensitive data",
  description:
    "Stop sharing plaintext passwords via email, Slack, and Discord. Send with Invisible instead.",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
