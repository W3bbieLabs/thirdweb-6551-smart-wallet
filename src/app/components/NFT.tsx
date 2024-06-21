import { ThirdwebNftMedia, useWallet } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import { useState } from "react";
import newSmartWallet from "./SmartWallet";
import { getContract, createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { sendTransaction } from "thirdweb";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import { claim, get_account } from "../const/utils";
import { Account } from "thirdweb/wallets";
import { StyledButton } from "../const/style";
import { allow_list, clientId, nftDropAddress } from "../const/constants";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const [smartWalletAddress, setSmartWalletAddres] = useState<
    string | undefined
  >(undefined);
  const wallet = useWallet();

  const client = createThirdwebClient({ clientId });

  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: nftDropAddress,
  });

  let createSmartWallet = async () => {
    if (!wallet) {
      return;
    }
    let smartWallet = newSmartWallet(nft);
    await smartWallet.connect({ personalWallet: wallet });
    let smart_wallet_address = await smartWallet.getAddress();
    setSmartWalletAddres(smart_wallet_address);
    claimToken(contract, smart_wallet_address);
  };

  let claimToken = async (contract: any, address: any) => {
    let account = await get_account();
    let tx = claim(
      contract,
      address,
      0n,
      1n,
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      0n,
      allow_list,
      "0x"
    );

    const transactionResult = await sendTransaction({
      transaction: tx,
      account: account as Account,
    });

    console.log("transactionResult", transactionResult);
  };
  return (
    <div>
      <ThirdwebNftMedia metadata={nft.metadata} />
      <p>Token ID: {nft.metadata.id}</p>
      <p>Name: {nft.metadata.name}</p>
      <p>Smart Wallet Address: {smartWalletAddress}</p>
      {!smartWalletAddress ? (
        <StyledButton onClick={createSmartWallet}>
          Claim with Smart Wallet
        </StyledButton>
      ) : (
        <div>
          <ThirdwebProviderV5></ThirdwebProviderV5>
        </div>
      )}
    </div>
  );
}
