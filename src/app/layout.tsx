"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { baseSepolia } from "thirdweb/chains";
import { clientId } from "./const/constants";

const inter = Inter({ subsets: ["latin"] });

/*
export const metadata: Metadata = {
  title: "thirdweb SDK + Next starter",
  description:
    "Starter template for using thirdweb SDK with Next.js App router",
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider activeChain={BaseSepoliaTestnet} clientId={clientId}>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}
