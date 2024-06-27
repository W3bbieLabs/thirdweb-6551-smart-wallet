/*
import {
  ThirdwebNftMedia,
  useWallet,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
*/
import { createThirdwebClient, NFT } from "thirdweb";
import React, { useState } from "react";
import newSmartWallet from "./SmartWallet";
import { clientId } from "../const/constants";
import { baseSepolia } from "thirdweb/chains";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./v0/NFT/card";
import { Badge } from "./v0/badge";
import { Button } from "./v0/button";
import { SmartWalletOptions } from "thirdweb/wallets";
import { smartWallet } from "thirdweb/wallets";
import { useActiveAccount, ConnectButton, MediaRenderer } from "thirdweb/react";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  //const wallet = useWallet();
  const router = useRouter();

  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  const newSmartWallet = (token: NFT) => {
    const config: SmartWalletOptions = {
      chain: baseSepolia,
      sponsorGas: true,
    };

    return smartWallet(config);
  };

  const createSmartWallet = async () => {
    if (!account) {
      return;
    }
    setIsLoading(true);
    let smart_wallet = newSmartWallet(nft);
    const smart_wallet_acount = await smart_wallet.connect({
      chain: baseSepolia,
      client,
      personalAccount: account!,
    });
    console.log("smart_wallet_acount", smart_wallet_acount);
    setSmartWalletAddress(smart_wallet_acount.address);

    setIsLoading(false);
  };

  const viewSmartWallet = () => {
    if (smartWalletAddress) {
      const encodedNft = encodeURIComponent(
        JSON.stringify(nft, (key, value) => {
          let out = typeof value === "bigint" ? value.toString() : value; // return everything else unchanged
          return out;
        })
      );
      console.log(encodedNft);
      router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
    }
  };

  return (
    <Card className="w-[250px] bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg">
      <CardContent className="p-0">
        {/*
        <ThirdwebNftMedia
          metadata={nft.metadata}
          className="w-full max-h-60 rounded-t-md"
          style={{ objectFit: "cover" }}
        />*/}
        <MediaRenderer
          style={{ objectFit: "cover" }}
          className="w-full max-h-60 rounded-t-md"
          client={client}
          src={nft.metadata.image}
        />
      </CardContent>
      <CardContent className="flex flex-col items-start p-4 space-y-2">
        <div className="flex justify-between w-full">
          <div className="text-lg font-semibold">{nft.metadata.name}</div>
          <Badge variant="outline">#{nft.metadata.id}</Badge>
        </div>
        {isLoading ? (
          <p className="text-blue-500 text-center w-full">Connecting...</p>
        ) : smartWalletAddress ? (
          <Button
            onClick={viewSmartWallet}
            variant="default"
            className="w-full bg-green-500 text-white"
          >
            View Smart Wallet
          </Button>
        ) : (
          <Button
            onClick={createSmartWallet}
            variant="default"
            className="w-full bg-blue-500 text-white"
          >
            Connect Smart Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
