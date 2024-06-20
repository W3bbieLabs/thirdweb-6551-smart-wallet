import { ThirdwebNftMedia, useWallet } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import { useState } from "react";
import newSmartWallet from "./SmartWallet";
import styled from "styled-components";
import SmartWalletComponent from "./SmartWalletComponent";

const StyledButton = styled.button`
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [smartWalletAddress, setSmartWalletAddres] = useState<
    string | undefined
  >(undefined);
  const [signer, setSigner] = useState<Signer>();
  const wallet = useWallet();

  let createSmartWallet = async () => {
    if (!wallet) {
      return;
    }
    let smartWallet = newSmartWallet(nft);
    await smartWallet.connect({ personalWallet: wallet });
    let _signer = await smartWallet.getSigner();
    let smart_wallet_address = await smartWallet.getAddress();
    setSigner(_signer);
    setSmartWalletAddres(smart_wallet_address);
  };
  return (
    <div>
      <ThirdwebNftMedia metadata={nft.metadata} />
      <p>Token ID: {nft.metadata.id}</p>
      <p>Name: {nft.metadata.name}</p>
      <p>Smart Wallet Address: {smartWalletAddress}</p>
      {!smartWalletAddress ? (
        <StyledButton onClick={createSmartWallet}>
          Connect Smart Wallet
        </StyledButton>
      ) : (
        <SmartWalletComponent signer={signer} />
      )}
    </div>
  );
}
