import {
  ThirdwebNftMedia,
  useWallet,
} from "@thirdweb-dev/react";
import { NFT as ThirdwebNFT } from "@thirdweb-dev/sdk";
import React, { useState } from "react";
import newSmartWallet from "./SmartWallet";
import { clientId } from "../const/constants";
import { createThirdwebClient, defineChain, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./v0/NFT/card";
import { Badge } from "./v0/badge";
import { Button } from "./v0/button";
import { useActiveAccount } from "thirdweb/react";

// Extend the ThirdwebNFT type to include supply
type NFTWithSupply = ThirdwebNFT & { supply: number };

const ERC6551_REGISTRY_ADDRESS = "0xF1d73C35BF140c6ad27e1573F67056c3EB0d48E8";
const ERC6551_ACCOUNT_ADDRESS = "0xE4584236E1C384CDcb541685a5d4E849e3fE15ab";
const NFT_COLLECTION_ADDRESS = "0x92F2666443EBFa7129f39c9E43758B33CD5D73F8";

type Props = {
  nft: NFTWithSupply;
  supply: number;
};

export default function NFTComponent({ nft, supply }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null);
  const wallet = useWallet();
  const router = useRouter();
  const account = useActiveAccount();

  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  async function createTokenBoundAccount(tokenId: string) {
    try {
      if (!account) {
        throw new Error("Account is not available");
      }

      const registryContract = getContract({
        client,
        chain: defineChain(84532),
        address: ERC6551_REGISTRY_ADDRESS,
      });

      const transaction = await prepareContractCall({
        contract: registryContract,
        method: `function createAccount(address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt, bytes initData) returns (address)`,
        params: [
          ERC6551_ACCOUNT_ADDRESS,
          BigInt(84532),
          NFT_COLLECTION_ADDRESS,
          BigInt(tokenId),
          BigInt(0),
          "0x"
        ]
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account
      });

      console.log("Token-bound account created! Transaction hash:", transactionHash);
    } catch (error) {
      console.error("Error creating token-bound account:", error);
      setError("Error creating token-bound account: " + (error as Error).message);
    }
  }

  const viewSmartWallet = () => {
    if (smartWalletAddress) {
      const encodedNft = encodeURIComponent(JSON.stringify(nft));
      router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
    }
  };

  const handleCreateTokenBoundAccount = () => {
    if (nft.metadata?.id) {
      createTokenBoundAccount(nft.metadata.id.toString());
    } else {
      setError("NFT ID is missing");
    }
  };

  return (
    <Card className="w-[250px] bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg">
      <CardContent className="p-0">
        <ThirdwebNftMedia metadata={nft.metadata} className="w-full max-h-60 rounded-t-md" style={{objectFit: "cover"}} />
      </CardContent>
      <CardContent className="flex flex-col items-start p-4 space-y-2">
        <div className="flex justify-between w-full">
          <div className="text-lg font-semibold">{nft.metadata?.name}</div>
          <Badge variant="outline">#{nft.metadata?.id?.toString()}</Badge>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Supply: {supply}</div>
        {isLoading ? (
          <p className="text-blue-500 text-center w-full">Connecting...</p>
        ) : smartWalletAddress ? (
          <Button onClick={viewSmartWallet} variant="default" className="w-full bg-green-500 text-white">
            View Smart Wallet
          </Button>
        ) : (
          <Button onClick={handleCreateTokenBoundAccount} variant="default" className="w-full bg-blue-500 text-white">
            Connect Smart Wallet
          </Button>
        )}
        {error && <p className="text-red-500 text-center w-full">{error}</p>}
      </CardContent>
    </Card>
  );
}
