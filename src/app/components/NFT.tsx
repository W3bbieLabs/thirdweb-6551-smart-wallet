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
import { useRouter } from "next/navigation"; // Adjusted to use Next.js 13 client-side navigation

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
    <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <ThirdwebNftMedia metadata={nft.metadata} className="w-full h-48 object-cover rounded-lg"/>
        <p className="text-lg font-bold mt-2">Token ID: {nft.metadata.id}</p>
        <p className="text-md">{nft.metadata.name}</p>
      </div>
      {isLoading ? (
        <p className="text-blue-500 text-center">Connecting...</p>
      ) : smartWalletAddress ? (
        <button
          onClick={viewSmartWallet}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700 w-full"
        >
          View Smart Wallet
        </button>
      ) : (
        <button
          onClick={createSmartWallet}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full"
        >
          Connect Smart Wallet
        </button>
      )}
    </div>
  );
}
