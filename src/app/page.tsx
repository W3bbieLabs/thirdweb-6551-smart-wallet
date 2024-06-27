"use client";
import {
  useContract,
  useOwnedNFTs,
  useAddress,
  ConnectWallet,
} from "@thirdweb-dev/react";
import { useRouter } from "next/navigation"; // Adjusted to use Next.js 13 client-side navigation
import { Container } from "./components/Container";
import NFTComponent from "./components/NFT";
import { useState, useEffect } from "react";
import { useActiveAccount, ConnectButton } from "thirdweb/react";
import { getContract, createThirdwebClient, defineChain, NFT as ThirdwebNFT } from "thirdweb";
import { resolveName } from "thirdweb/extensions/ens";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";

// Extend the ThirdwebNFT type to include supply and ensure consistent metadata types
type NFTWithSupply = ThirdwebNFT & { supply: number; metadata: { id: string } };

export default function Home() {
  const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
  const NFT_COLLECTION_ADDRESS = "0x92F2666443EBFa7129f39c9E43758B33CD5D73F8";

  const router = useRouter();
  const account = useActiveAccount();
  const [wallet, setWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ownedNFTs, setOwnedNFTs] = useState<NFTWithSupply[] | null>(null);
  const [creatorName, setCreatorName] = useState<string | null>(null);

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

  useEffect(() => {
    if (account?.address) {
      setWallet(account.address);
      fetchEnsName(account.address);
    }
  }, [account]);

  const client = createThirdwebClient({
    secretKey: secretKey as string, // ensure that secretKey is not undefined
  });

  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: NFT_COLLECTION_ADDRESS,
  });

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      try {
        if (account) {
          const ownerAddress = account.address;
          const nfts = await getOwnedNFTs({
            contract,
            owner: ownerAddress,
          });

          const nftsWithSupply = await Promise.all(
            nfts.map(async (nft) => {
              // Assuming you have a way to fetch the supply, replace with actual logic
              const supply = await fetchSupply(nft.id.toString());
              return { ...nft, supply, metadata: { ...nft.metadata, id: nft.id.toString() } };
            })
          );

          setOwnedNFTs(nftsWithSupply);
        }
      } catch (err) {
        console.error("Error fetching owned NFTs:", err);
        setError("Error fetching owned NFTs: " + (err as Error).message);
      }
    };

    fetchOwnedNFTs();
  }, [account]);

  if (error) {
    return <div>{error}</div>;
  }

  let showNFTS = (nfts: NFTWithSupply[]) => {
    if (nfts?.length > 0) {
      return (
        <div>
          {nfts.map((nft) => (
            <NFTComponent key={nft.metadata.id} nft={nft} supply={nft.supply} />
          ))}
        </div>
      );
    } else {
      return (
        <Container className="min-h-screen flex items-start mt-24 justify-center">
          <div className="text-center">
            You do not own a Membership Token. Click{" "}
            <a
              href="https://avatar-basedart.vercel.app/"
              target="_blank"
              className="dark:text-blue-600 text-foreground-dark"
            >
              here
            </a>{" "}
            to claim a membership token.
          </div>
        </Container>
      );
    }
  };

  return (
    <main className="bg-gray-100 dark:bg-gray-900 p-4 pb-10 flex justify-center mx-auto min-h-screen">
      <div className="lg:px-20 lg:py-8 md:p-12 p-4">
        {account ? (
          ownedNFTs && ownedNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {showNFTS(ownedNFTs || [])}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              {showNFTS(ownedNFTs || [])}
            </div>
          )
        ) : (
          <Container className="min-h-screen flex items-start mt-24 justify-center">
            <div className="text-center">
              Please connect your wallet to view your NFTs.
            </div>
          </Container>
        )}
      </div>
    </main>
  );
}

async function fetchSupply(nftId: string): Promise<number> {
  // Implement the logic to fetch the supply for the NFT
  // This is a placeholder implementation
  return 1;
}
