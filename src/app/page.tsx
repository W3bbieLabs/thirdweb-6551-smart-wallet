"use client";
import {
  useContract,
  useOwnedNFTs,
  useAddress,
  ConnectWallet,
} from "@thirdweb-dev/react";
import NFTComponent from "./components/NFT";
import {
  ConnectButton,
  useActiveWallet,
  useActiveAccount,
} from "thirdweb/react";
import { nftDropAddress, client, wallets } from "./const/constants";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import { NFT } from "@thirdweb-dev/react";

export default function Home() {
  const address = useAddress();

  console.log("address", address);
  //const wallet = useActiveWallet();
  //const activeAccount = useActiveAccount();
  const { contract } = useContract(nftDropAddress);
  const { data: nfts, isLoading: useOwnedIsLoading } = useOwnedNFTs(
    contract,
    address
  );

  let showNFTS = (nfts: NFT[]) => {
    console.log("nfts", nfts);
    if (nfts?.length > 0) {
      return nfts.map((nft) => {
        return <NFTComponent key={nft.metadata.id} nft={nft} />;
        //return <div>hi</div>;
      });
    } else {
      return (
        <div>
          You do not own a Membership Token. Click{" "}
          <a
            href="https://avatar-basedart.vercel.app/"
            target="_blank"
            className="text-blue-600"
          >
            here
          </a>{" "}
          to claim a membership token.
        </div>
      );
    }
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-10">
          <ConnectWallet />
          {/*
          <ThirdwebProviderV5>
            <ConnectButton client={client} wallets={wallets} />
          </ThirdwebProviderV5>
        */}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {showNFTS(nfts || [])}
        </div>
      </div>
    </main>
  );
}
