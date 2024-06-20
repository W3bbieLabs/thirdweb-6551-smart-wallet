"use client";
import Image from "next/image";
import {
  ConnectWallet,
  Web3Button,
  useContract,
  useOwnedNFTs,
  useAddress,
  ChainId,
  useWallet,
  useConnect,
} from "@thirdweb-dev/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import newSmartWallet from "./components/SmartWallet";
import { useState } from "react";
import { Signer } from "ethers";
import { LocalWallet } from "@thirdweb-dev/wallets";
import NFTComponent from "./components/NFT";

import {
  implementation,
  nftDropAddress,
  activeChain,
  factoryAddress,
  TWApiKey,
} from "./const/constants";

export default function Home() {
  const [smartWalletAddress, setSmartWalletAddres] = useState<
    string | undefined
  >(undefined);
  const [signer, setSigner] = useState<Signer>();

  const address = useAddress();
  const mm_wallet = useWallet();

  const {
    contract,
    isLoading: isLoadUseContract,
    error,
  } = useContract(nftDropAddress);

  const { data: nfts, isLoading: useOwnedIsLoading } = useOwnedNFTs(
    contract,
    address
  );

  let test = async () => {
    let nft = nfts ? nfts[0] : null;
    console.log("nft", nft);
    if (nft) {
      const smartWallet = newSmartWallet(nft);
      await smartWallet.connect({ personalWallet: mm_wallet });
      let _signer = await smartWallet.getSigner();
      let smart_wallet_address = await smartWallet.getAddress();
      setSigner(_signer);
      setSmartWalletAddres(smart_wallet_address);
      console.log("smartWallet", smartWallet);
      console.log("signer", _signer);
      console.log("smart_wallet_address", smart_wallet_address);
    }
  };

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <div className="flex justify-center mb-20">
          <ConnectWallet />
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {nfts
            ? nfts.map((nft) => (
                <div key={nft.metadata.id}>
                  <NFTComponent nft={nft} />
                </div>
              ))
            : null}
          {/*
          <Web3Button
            contractAddress={nftDropAddress}
            action={(contract) => contract.erc721.claim(1)}
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            Claim NFT
          </Web3Button>
    */}
        </div>
      </div>
    </main>
  );
}
