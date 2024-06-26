"use client";
import {
  useContract,
  useOwnedNFTs,
  useAddress,
  ConnectWallet,
  NFT,
} from "@thirdweb-dev/react";
import { useRouter } from "next/navigation"; // Adjusted to use Next.js 13 client-side navigation
import { nftDropAddress } from "./const/constants";
import { Container } from "./components/Container";
import NFTComponent from "./components/NFT";
import { useChain } from "@thirdweb-dev/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";

export default function Home() {
  const address = useAddress();
  const router = useRouter();
  const chain = useChain();

  console.log("address", address);
  const { contract } = useContract(nftDropAddress);
  const { data: nfts, isLoading: useOwnedIsLoading } = useOwnedNFTs(
    contract,
    address
  );

  const handleConnectSmartWallet = (smartWalletAddress: string, nft: NFT) => {
    const encodedNft = encodeURIComponent(JSON.stringify(nft));
    router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
  };

  let showNFTS = (nfts: NFT[]) => {
    console.log("nfts", nfts);
    if (nfts?.length > 0) {
      return nfts.map((nft) => (
        <NFTComponent
          key={nft.metadata.id}
          nft={nft}
        />
      ));
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
    <main className="p-4 pb-10 flex items-center justify-center container mx-auto min-h-screen">
      <div className="lg:px-20 lg:py-8 md:p-12 p-4">
        {chain?.chainId === BaseSepoliaTestnet.chainId ? (
          nfts && nfts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {showNFTS(nfts || [])}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              {showNFTS(nfts || [])}
            </div>
          )
        ) : (
          <Container className="min-h-screen flex items-start mt-24 justify-center">
            <div className="text-center">
              Please switch to the Base Sepolia Testnet to view your NFTs.
            </div>
          </Container>
        )}
      </div>
    </main>
  );
}
