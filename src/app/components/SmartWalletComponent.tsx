import {
  ThirdwebNftMedia,
  useWallet,
  ThirdwebSDKProvider,
  Web3Button,
  useAddress,
  useContract,
  useClaimNFT,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import { useState } from "react";
import newSmartWallet from "./SmartWallet";
import styled from "styled-components";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { Signer } from "ethers";
import { idNFT } from "../const/constants";
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { sendTransaction } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc1155";

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
  signer: Signer;
};

export default function SmartWalletComponent({ signer }: any) {
  const [isClaiming, setIsClaiming] = useState(false);

  return (
    <ThirdwebSDKProvider signer={signer} activeChain={BaseSepoliaTestnet}>
      <div>Smart Wallet stuff here</div>
      <div>{idNFT}</div>
      <ClaimTokens />
    </ThirdwebSDKProvider>
  );
}

const _test = async () => {
  /*
  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126",
  });

  const transaction = claimTo({
    contract,
    address,
    amount: 1,
    tokenId: BigInt(0),
  });

  console.log("contract", contract);
  console.log("transaction", transaction);

  sendTransaction(transaction);
  */
  //contract.erc1155.claim(0, 1);
};

const ClaimTokens = () => {
  const address = useAddress();
  const { contract } = useContract(
    "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126"
  );
  const { mutate: claim, isLoading, error } = useClaimNFT(contract);
  console.log("contract", contract);

  let test = async () => {
    //console.log(claim);
    claim({ quantity: 1 });
  };

  return <StyledButton onClick={test}>Claim Membership</StyledButton>;
  /*
    <Web3Button
      contractAddress={idNFT}
      action={(contract) => {
        claim({ quantity: 1 });
      }}
    >
      Claim NFT
    </Web3Button>
    */
};
