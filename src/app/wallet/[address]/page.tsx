"use client";
import { useSearchParams } from "next/navigation"; // Adjusted to use Next.js 13 client-side navigation
import React, { useState, useEffect } from "react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { getContract, createThirdwebClient, prepareContractCall, sendTransaction, NFT } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { clientId, allow_list } from "@/app/const/constants";
import { Container } from "@/app/components/Container";
import Image from "next/image";
import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { useActiveAccount } from "thirdweb/react";

export default function WalletPage({ params }: { params: { address: string } }) {
  const searchParams = useSearchParams();
  const nftParam = searchParams.get("nft");
  const nft = nftParam ? JSON.parse(decodeURIComponent(nftParam)) : null;
  console.log(nft)

  const [nfts, setNfts] = useState<(NFT & { quantityOwned: bigint })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeAccount = useActiveAccount();

  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  const contractAddress = "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126";
  const contract = getContract({
    client,
    chain: baseSepolia,
    address: contractAddress,
  });

  useEffect(() => {
    if (params.address) {
      fetchNFTs(params.address);
    }
  }, [params.address]);

  const fetchNFTs = async (walletAddress: string) => {
    const ownedNFTs = await getOwnedNFTs({
      contract,
      start: 0,
      count: 10,
      address: walletAddress,
    });
    console.log("Owned NFTs:", ownedNFTs);
    setNfts(ownedNFTs);
  };

  const claimToken = async () => {
    setIsLoading(true);

    const tx = prepareContractCall({
      contract,
      method:
        "function claim(address _receiver, uint256 _tokenId,  uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[],uint256,uint256,address) _allowlistProof, bytes _data) public",
      params: [
        params.address,
        0n,
        1n,
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        0n,
        allow_list,
        "0x",
      ],
    } as any);

    
    const transactionResult = await sendTransaction({
      transaction: tx,
      account: activeAccount!,
    });

    console.log("transactionResult", transactionResult);
    await fetchNFTs(params.address);
    setIsLoading(false);
  };

  const formatIpfsUrl = (url: string) => {
    if (url.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${url.slice(7)}`;
    }
    return url;
  };

  return (
    <Container className="min-h-screen p-24 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg">
        {nft && (
          <>
            <ThirdwebNftMedia metadata={nft.metadata} className="w-full h-48 object-cover rounded-lg"/>
            <p className="text-lg font-bold mt-2">Token ID: {nft.metadata.id}</p>
            <p className="text-md">{nft.metadata.name}</p>
          </>
        )}
        <h2 className="text-3xl font-bold text-center break-words mt-6">Smart Wallet Address: {params.address}</h2>
      </div>
      <div className="col-span-2 bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold">Collectibles</h3>
        {nfts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {nfts.map((nft, idx) => (
              <div key={idx} className="p-4 border rounded-lg shadow-sm bg-gray-700 text-white">
                <p className="text-lg font-medium">ID: {nft.id.toString()}</p>
                <p className="text-base">Name: {nft.metadata.name}</p>
                <p className="text-sm text-gray-400">Description: {nft.metadata.description}</p>
                { nft.metadata && (
                  <ThirdwebNftMedia metadata={{ ...nft.metadata, id: nft.id.toString() }} className="w-full h-48 object-cover rounded-lg"/>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p>No NFTs owned</p>
            <button
              onClick={claimToken}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Claiming...' : 'Claim ERC1155 Token'}
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}
