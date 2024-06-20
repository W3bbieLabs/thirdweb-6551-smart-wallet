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
import { prepareContractCall } from "thirdweb";
import {
  useSendTransaction,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

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
      <ClaimTokens claim_signer={signer} />
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

const ClaimTokens = ({ claim_signer }: any) => {
  //const { mutate: sendTransaction, isPending } = useSendTransaction();

  const sdk = new ThirdwebSDK(claim_signer);

  //const contractAddress = "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126";

  //console.log("sdk", sdk);

  const client = createThirdwebClient({
    clientId: "6f548b049f47f192d385041415b48f24",
  });

  const account = useActiveAccount();

  const address = useAddress();
  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(84532),
    address: "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126",
  });

  /*
  const { contract } = useContract(
    "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126",
    "edition"
  );
  */

  //const { mutate: claim, isLoading, error } = useClaimNFT(contract);
  //console.log("contract", contract);

  let test = async () => {
    console.log(TransactionButton);
    /*
    const erc1155 = await sdk.getContract(contractAddress);
    console.log("erc1155", erc1155);
    let currency = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    let contract_address = "0x5dabeEBc71B75fb9681D67CC4aeB654c6c858126";
    let _data = "0x";
    let allow_list = [
      ["0x0000000000000000000000000000000000000000000000000000000000000000"],
      "115792089237316195423570985008687907853269984665640564039457584007913129639935",
      "0",
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    ];
    const tx = await erc1155.call("claim", [
      address,
      0,
      1,
      currency,
      0,
      allow_list,
      _data,
    ]);
    const receipt = tx.receipt;
    console.log("receipt", receipt);
    */
    //const claimTransaction = await erc1155.claim(0, 1);
    //const receipt = await claimTransaction.wait(); // Wait for the transaction to be mined
    //const mintTransaction = await erc1155.mintTo(address, 0, 1);
    //const receipt = await mintTransaction.wait();
    //console.log("Token claimed successfully!", receipt);
    //console.log(ThirdwebSDK);
    //console.log(claim);
    //claim({ to: address, quantity: 1, tokenId: 0 });
    /*
    const transaction = prepareContractCall({
      contract,
      method: "function mint(address to)",
      params: ["0x..."],
      value: BigInt(0),
    });
    sendTransaction(transaction);

    */
  };

  return (
    <TransactionButton
      transaction={() =>
        claimTo({
          contract,
          to: account?.address as string,
          quantity: BigInt(1),
          tokenId: BigInt(0),
        })
      }
    >
      Claim Membership
    </TransactionButton>
  );
  //return <StyledButton onClick={test}>Claim Membership</StyledButton>;
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
