import {
  ThirdwebNftMedia,
  useWallet,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import newSmartWallet from "./SmartWallet";
import { clientId } from "../const/constants";
import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./v0/NFT/card";
import { Badge } from "./v0/badge";
import { Button } from "./v0/button";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null);
  const wallet = useWallet();
  const router = useRouter();

  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  const createSmartWallet = async () => {
    if (!wallet) {
      return;
    }
    setIsLoading(true);
    let smartWallet = newSmartWallet(nft);
    let _account = await smartWallet.connect({ personalWallet: wallet });
    let smart_wallet_address = await smartWallet.getAddress();
    setSmartWalletAddress(smart_wallet_address);
    setIsLoading(false);
  };

  const viewSmartWallet = () => {
    if (smartWalletAddress) {
      const encodedNft = encodeURIComponent(JSON.stringify(nft));
      router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
    }
  };

  return (
    <Card className="w-[250px] bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg">
      <CardContent className="p-0">
        <ThirdwebNftMedia metadata={nft.metadata} className="w-full max-h-60 rounded-t-md" style={{objectFit: "cover"}} />
      </CardContent>
      <CardContent className="flex flex-col items-start p-4 space-y-2">
      <div className="flex justify-between w-full">
        <div className="text-lg font-semibold">{nft.metadata.name}</div>
        <Badge variant="outline">#{nft.metadata.id}</Badge>
        </div>
        {isLoading ? (
          <p className="text-blue-500 text-center w-full">Connecting...</p>
        ) : smartWalletAddress ? (
          <Button onClick={viewSmartWallet} variant="default" className="w-full bg-green-500 text-white">
            View Smart Wallet
          </Button>
        ) : (
          <Button onClick={createSmartWallet} variant="default" className="w-full bg-blue-500 text-white">
            Connect Smart Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
