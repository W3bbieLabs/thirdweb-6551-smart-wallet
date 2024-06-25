// /app/components/Header.tsx
"use client";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";
import { ConnectWallet } from "@thirdweb-dev/react";
import MobileNavigation from "./MobileNavigation";

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="">
      <Container>
        <nav className="relative z-50 flex justify-between items-center p-2">
          <div className="flex items-center md:gap-x-12 justify-center">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src={theme === "dark" ? "/pgc-logo-dark.png" : "/pgc-logo-light.png"}
                  alt="public goods logo image"
                  width={50}
                  height={50}
                />
              </div>
            </Link>
          </div>
          <div className="hidden md:flex md:gap-x-6 ">
            <NavLink href="/">Community</NavLink>
            <NavLink href="/">Learn</NavLink>
            <NavLink href="/"> My NFTs</NavLink>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <ConnectWallet />
            </div>
            <ThemeToggle />
            <div className="-mr-1 md:hidden">
              <MobileNavigation />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
