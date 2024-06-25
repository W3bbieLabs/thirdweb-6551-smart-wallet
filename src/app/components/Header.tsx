"use client";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
// import MobileNavigation from "./MobileNavigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

import { useTheme } from "next-themes";
import { wallets, client } from "../const/constants";
import { ConnectWallet } from "@thirdweb-dev/react";

export function Header() {
  const { theme } = useTheme();

  // const themeConfig =
  //   theme === "dark"
  //     ? darkTheme({
  //         colors: {
  //           primaryButtonBg: "#315DF7",
  //           primaryButtonText: "#fdfcfd",
  //         },
  //       })
  //     : lightTheme({
  //         colors: {
  //           primaryButtonBg: "#fdfcfd",
  //           primaryButtonText: "#1a1523",
  //         },
  //       });

  const connectButtonConfig = { label: "Connect" };

  const connectModalConfig = {
    size: "wide" as const,
    title: "Get Started",
    titleIcon: theme === "dark" ? "/pgc-logo-dark.png" : "/pgc-logo-light.png",
  };

  return (
    <header className="">
      <Container>
        <nav className="relative z-50 flex justify-between items-center pt-8">
          <div className="flex items-center md:gap-x-12 justify-center">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src={"/pgc-logo-dark.png"}
                  alt="public goods logo image"
                  width={50}
                  height={50}
                />
              </div>
            </Link>
          </div>
          {/* <div className="hidden md:flex md:gap-x-6 ">
            <NavLink href="/">Placeholder</NavLink>
            <NavLink href="/">Placeholder</NavLink>
            <NavLink href="/">Placeholder</NavLink>
          </div> */}
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {/* <ConnectButton
                client={client}
                wallets={wallets}
                theme={themeConfig}
                connectButton={connectButtonConfig}
                connectModal={connectModalConfig}
              /> */}
              <ConnectWallet/>
            </div>
            <ThemeToggle />
            <div className="-mr-1 md:hidden">
              {/* <MobileNavigation /> */}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
