import { createThirdwebClient, NFT } from "thirdweb";
import React, { useState } from "react";
import { baseSepolia, base } from "thirdweb/chains";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./v0/NFT/card";
import { Badge } from "./v0/badge";
import { Button } from "./v0/button";
import { useActiveAccount, MediaRenderer } from "thirdweb/react";
import {
  registry_contract,
  get_tba_address,
  newSmartWallet,
  client,
  active_chain_id,
  get_generic_contract,
  get_tba_owner,
  create_tba_account,
} from "../const/utils";

type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );

  const router = useRouter();

  const createSmartWallet = async () => {
    if (!account) {
      return;
    }
    setIsLoading(true);
    //console.log("creating smart wallet");

    let smart_wallet = newSmartWallet();
    const smart_wallet_acount = await smart_wallet.connect({
      chain: base,
      client,
      personalAccount: account!,
    });
    //console.log("smart_wallet", smart_wallet_acount)

    let token_bound_address = await get_tba_address(
      nft,
      registry_contract,
      active_chain_id
    );

    let tba_contract = await get_generic_contract(token_bound_address);
    console.log("tba_contract", tba_contract);

    try {
      let tba_owner = await get_tba_owner(tba_contract);
      console.log("tba", token_bound_address, "tba_owner", tba_owner);
      setSmartWalletAddress(token_bound_address);
      setIsLoading(false);
    } catch (e) {
      //console.log("error", e);
      console.log("creating TBA account.");

      // No ownder found, create TBA account
      let tx = await create_tba_account(
        account!,
        nft,
        registry_contract,
        active_chain_id
      );
      console.log("tx", tx);

      setTimeout(async () => {
        let tba_owner = await get_tba_owner(tba_contract);
        console.log("tba", token_bound_address, "tba_owner", tba_owner);
        setSmartWalletAddress(token_bound_address);
        setIsLoading(false);
      }, 3000);
    }
  };

  const viewSmartWallet = () => {
    if (smartWalletAddress) {
      const encodedNft = encodeURIComponent(
        JSON.stringify(nft, (key, value) => {
          let out = typeof value === "bigint" ? value.toString() : value; // return everything else unchanged
          return out;
        })
      );
      router.push(`/wallet/${smartWalletAddress}?nft=${encodedNft}`);
    }
  };

  return (
    <Card className="w-[250px] bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-lg">
      <CardContent className="p-0">
        <MediaRenderer
          style={{ objectFit: "cover" }}
          className="w-full max-h-60 rounded-t-md"
          client={client}
          src={nft.metadata.image}
        />
      </CardContent>
      <CardContent className="flex flex-col items-start p-4 space-y-2">
        <div className="flex justify-between w-full">
          <div className="text-lg font-semibold">{nft.metadata.name}</div>
          <Badge variant="outline">#{nft.id.toString()}</Badge>
        </div>
        {isLoading ? (
          <p className="text-blue-500 text-center w-full">Connecting...</p>
        ) : smartWalletAddress ? (
          <Button
            onClick={viewSmartWallet}
            variant="default"
            className="w-full bg-green-500 text-white"
          >
            View Smart Wallet
          </Button>
        ) : (
          <Button
            onClick={createSmartWallet}
            variant="default"
            className="w-full bg-blue-500 text-white"
          >
            Connect Smart Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
