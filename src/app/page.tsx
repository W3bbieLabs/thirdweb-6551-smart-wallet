"use client";

import { NFT } from "thirdweb";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Adjusted to use Next.js 13 client-side navigation
import { Container } from "./components/Container";
import NFTComponent from "./components/NFT";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import { useActiveAccount } from "thirdweb/react";
import { bounded_token_contract } from "@/app/const/utils";

export default function Home() {
  //const address = useAddress();
  const account = useActiveAccount();
  const [wallet_address, setWalletAddress] = useState<string>("");
  const [ownedNFTs, setOwnedNFTs] = useState<NFT[] | null>([]);

  useEffect(() => {
    const fetch_nfts = async () => {
      if (!account?.address) {
        throw new Error("Account is not connected.");
      }

      const nfts = await getOwnedNFTs({
        contract: bounded_token_contract,
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

  /*
  const handleConnectSmartWallet = (smartWalletAddress: string, nft: NFT) => {
    const encodedNft = encodeURIComponent(JSON.stringify(nft));
    router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
  };
  */

  let showNFTS = (nfts: NFT[]) => {
    //console.log("nfts", nfts);

    if (nfts?.length > 0) {
      return nfts.map((nft) => (
        <NFTComponent key={nft.metadata.id} nft={nft} />
      ));
    } else {
      return (
        <Container className="min-h-screen flex items-start mt-24 justify-center">
          <div className="text-center">
            You do not own a Membership Token. Click{" "}
            <a
              href="https://www.pgc-members.xyz/"
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
