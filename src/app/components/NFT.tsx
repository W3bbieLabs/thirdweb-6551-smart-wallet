import {
  ThirdwebNftMedia,
  useWallet,
  ThirdwebSDKProvider,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import { useState } from "react";
import newSmartWallet from "./SmartWallet";
import styled from "styled-components";
import { clientId } from "../const/constants";
//import { claimTo } from "thirdweb/extensions/erc1155";
import { Signer } from "ethers";
import { getContract, createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { prepareContractCall, sendTransaction } from "thirdweb";
//import { useActiveWallet } from "thirdweb/react";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import { WalletId, createWallet, injectedProvider } from "thirdweb/wallets";
import { claim2, get_wallet_id } from "../const/utils";
import { allow_list } from "../const/constants";

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
  //const [isClaiming, setIsClaiming] = useState(false);
  //const [smartWalletObject, setSmartWalletObject] = useState<any>(undefined);
  const [smartWalletAddress, setSmartWalletAddres] = useState<
    string | undefined
  >(undefined);
  const [signer, setSigner] = useState<Signer>();
  const wallet = useWallet();

  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126",
  });

  let createSmartWallet = async () => {
    if (!wallet) {
      return;
    }
    let smartWallet = newSmartWallet(nft);
    //setSmartWalletObject(smartWallet);
    let _account = await smartWallet.connect({ personalWallet: wallet });
    let _signer = await smartWallet.getSigner();
    let smart_wallet_address = await smartWallet.getAddress();
    setSigner(_signer);
    setSmartWalletAddres(smart_wallet_address);
    claimToken(smartWallet, smart_wallet_address, _account);
  };

  let claimToken = async (_wallet: any, _address: any, _account: any) => {
    const client = createThirdwebClient({ clientId });

    let wallet_type: WalletId = (await get_wallet_id()) as WalletId;
    const metamask = createWallet(wallet_type); // pass the wallet id

    // if user has metamask installed, connect to it
    if (injectedProvider(wallet_type)) {
      let _account = await metamask.connect({ client });
      const tx = prepareContractCall({
        contract,
        // Pass the method signature that you want to call
        method:
          "function claim(address _receiver, uint256 _tokenId,  uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[],uint256,uint256,address) _allowlistProof, bytes _data) public",
        params: [
          _address,
          0n,
          1n,
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          0n,
          allow_list,
          "0x",
        ],
      });

      const transactionResult = await sendTransaction({
        transaction: tx,
        account: _account,
      });

      console.log("transactionResult", transactionResult);
    }
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
        <div>
          <ThirdwebProviderV5></ThirdwebProviderV5>
        </div>
      )}
    </div>
  );
}
