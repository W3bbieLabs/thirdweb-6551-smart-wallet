// /app/components/Header.tsx
"use client";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";
import { ConnectWallet } from "@thirdweb-dev/react";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <Container>
        <nav className="relative z-50 flex flex-col md:flex-row items-center justify-between p-4 md:px-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <>
                <Image
                  src={theme === "dark" ? "/pgc-logo-dark.png" : "/pgc-logo-light.png"}
                  alt="public goods logo image"
                  width={50}
                  height={50}
                />
              </>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="#" className="text-muted-foreground dark:text-gray-300" prefetch={false}>
              Community
            </Link>
            <Link href="#" className="text-muted-foreground dark:text-gray-300" prefetch={false}>
              Learn
            </Link>
            <Link href="/" className="text-muted-foreground dark:text-gray-300" prefetch={false}>
              My NFTs
            </Link>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <ConnectWallet />
            </div>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
