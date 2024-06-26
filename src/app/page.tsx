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

export default function Home() {
  const address = useAddress();
  const router = useRouter();

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
        <Container className="min-h-screen">
          You do not own a Membership Token. Click{" "}
          <a
            href="https://avatar-basedart.vercel.app/"
            target="_blank"
            className="text-blue-600"
          >
            here
          </a>{" "}
          to claim a membership token.
        </Container>
      );
    }
  };

  return (
    <main className="p-4 pb-10 flex items-center justify-center container mx-auto">
      <div className="lg:px-20 lg:py-4 md:p-12 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {showNFTS(nfts || [])}
        </div>
      </div>
    </main>
  );
}
