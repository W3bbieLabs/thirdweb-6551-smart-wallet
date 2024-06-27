"use client";

/*
import {
  useContract,
  useOwnedNFTs,
  useAddress,
  ConnectWallet,
  NFT,
} from "@thirdweb-dev/react";
 */
import {
  getContract,
  createThirdwebClient,
  defineChain,
  NFT,
  prepareContractCall,
  sendTransaction,
} from "thirdweb";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Adjusted to use Next.js 13 client-side navigation
import { nftDropAddress } from "./const/constants";
import { Container } from "./components/Container";
import NFTComponent from "./components/NFT";
//import { useChain } from "@thirdweb-dev/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
import { CreateThirdwebClientOptions } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
const NFT_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS;
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { useActiveAccount, ConnectButton, MediaRenderer } from "thirdweb/react";

export default function Home() {
  //const address = useAddress();
  const router = useRouter();
  const account = useActiveAccount();
  const [wallet_address, setWalletAddress] = useState<string>("");
  const [smart_wallet_address, setSmartWalletAddress] = useState<string>("");

  const [ownedNFTs, setOwnedNFTs] = useState<NFT[] | null>([]);

  //const chain = useChain();

  //log("address", address);

  /*
  const { contract } = useContract(nftDropAddress);
  const { data: nfts, isLoading: useOwnedIsLoading } = useOwnedNFTs(
    contract,
    address
  );
  */

  useEffect(() => {
    const fetch_nfts = async () => {
      if (!account?.address) {
        throw new Error("Account is not connected.");
      }

      const nfts = await getOwnedNFTs({
        contract,
        owner: account?.address,
      });

      if (ownedNFTs?.length === 0) {
        setOwnedNFTs(nfts);
      }
    };

    if (account?.address) {
      setWalletAddress(account.address);
      fetch_nfts();
    }
  }, [account, ownedNFTs]);

  const client = createThirdwebClient({
    clientId: CLIENT_ID!,
    secretKey: undefined,
  });

  const contract = getContract({
    client,
    chain: baseSepolia,
    address: NFT_COLLECTION_ADDRESS!,
  });

  const handleConnectSmartWallet = (smartWalletAddress: string, nft: NFT) => {
    const encodedNft = encodeURIComponent(JSON.stringify(nft));
    router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
  };

  let showNFTS = (nfts: NFT[]) => {
    console.log("nfts", nfts);
    //<NFTComponent key={nft.metadata.id} nft={nft} />
    if (nfts?.length > 0) {
      return nfts.map((nft) => <div>show NFT here.</div>);
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
    <main className="bg-gray-100 dark:bg-gray-900 p-4 pb-10 flex justify-center mx-auto min-h-screen ">
      <div className="lg:px-20 lg:py-8 md:p-12 p-4">
        {ownedNFTs && ownedNFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {showNFTS(ownedNFTs || [])}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            {showNFTS(ownedNFTs || [])}
          </div>
        )}
      </div>
    </main>
  );
}
