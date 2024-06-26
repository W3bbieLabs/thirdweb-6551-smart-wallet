// /app/components/Header.tsx
"use client";
import { Container } from "./Container";
import { NavLink } from "./NavLink";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import MobileNavigation from "./MobileNavigation";
import { createWallet } from "thirdweb/wallets";
import { createThirdwebClient, defineChain, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useEffect, useState } from "react";
import { resolveName } from "thirdweb/extensions/ens";

const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
const NFT_COLLECTION_ADDRESS = "0x92F2666443EBFa7129f39c9E43758B33CD5D73F8";

interface HeaderProps {
  client: any;
  wallets: any[];
  chain: any;
}

const wallets = [
  createWallet("com.coinbase.wallet"),
  createWallet("io.metamask"),
];

const Header = () => {
  const account = useActiveAccount();
  const [wallet, setWallet] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string | null>(null);

  useEffect(() => {
    if (account?.address) {
      setWallet(account.address);
      fetchEnsName(account.address);
    }
  }, [account]);

  const client = createThirdwebClient({
    secretKey: secretKey as string, // ensure that secretKey is not undefined
  });

  const chain = defineChain(84532);
  const contract = getContract({
    client,
    chain,
    address: NFT_COLLECTION_ADDRESS,
  });

  const fetchEnsName = async (address: string) => {
    try {
      const ensName = await resolveName({
        client,
        address: address,
      });
      if (ensName) {
        setCreatorName(ensName);
      } else {
        setCreatorName(address.slice(0, 3) + '...' + address.slice(-3));
      }
    } catch (error) {
      console.error("Error resolving ENS name:", error);
      setCreatorName(address.slice(0, 3) + '...' + address.slice(-3));
    }
  };

  const { theme } = useTheme();

  return (
    <header className="">
      <Container>
        <nav className="relative z-50 flex justify-between items-center p-4 md:pt-4">
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
          <div className="hidden md:flex md:gap-x-6">
            <NavLink href="https://x.com/PublicGoodsClub" target="_blank">Community</NavLink>
            <NavLink href="https://mirror.xyz/bigtrav.eth/6hD4LTjGWC8TXef4DGIxbdVSibreKLTWila-wOku0DM" target="_blank">Learn</NavLink>
            <NavLink href="/"> My NFTs</NavLink>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              <ConnectButton 
                client={client}
                wallets={wallets}
                chain={chain}
                theme={"dark"}
                appMetadata={{
                  name: "Avatar",
                  url: "https://example.com",
                }}
                connectButton={{ label: "Log In or Sign Up" }}
                connectModal={{
                  size: "wide",
                  title: "Choose Method",
                  welcomeScreen: {
                    title: "PublicGoodsClub",
                    img: {
                      src: "https://media.discordapp.net/attachments/1244435318006874163/1248808384753434634/PGC_Flower_Logo.png?ex=666502f0&is=6663b170&hm=88b38c7b5a86511dcb2d2e5c6d5c02ecde91dd8a880a65ada02924a5db318d87&=&format=webp&quality=lossless",
                      width: 150,
                      height: 150,
                    },
                  },
                  showThirdwebBranding: false,
                }}
              />
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
};

export default Header;
