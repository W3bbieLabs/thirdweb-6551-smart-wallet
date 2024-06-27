"use client";
import { Inter } from "next/font/google";
import "./globals.css";
//import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebProvider } from "thirdweb/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { clientId } from "./const/constants";
import { Header } from "./components/Header";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background-light dark:bg-background-dark min-h-screen">
        <ThirdwebProvider>
          <ThemeProvider attribute="class">
            <Header />
            <main className="flex-grow">{children}</main>
          </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
