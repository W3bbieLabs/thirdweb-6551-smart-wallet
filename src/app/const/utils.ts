import { prepareContractCall } from "thirdweb";
import { ContractOptions } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";
import { client } from "./constants";
import { WalletId } from "thirdweb/wallets";

export const truncate = (address: string, chars: number) => {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

export const claim = (contract: ContractOptions, address: string, token_id: bigint, quantity: bigint, currency: string, price_per_token: bigint, allow_list_proof: any, data: string) => {
    const tx = prepareContractCall({
        contract,
        method:
            "function claim(address _receiver, uint256 _tokenId,  uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[],uint256,uint256,address) _allowlistProof, bytes _data) public",
        params: [address, token_id, quantity, currency, price_per_token, allow_list_proof, data]
    } as any);
    return tx
}

const supported_wallets: WalletId[] = ["io.metamask", "com.coinbase.wallet", "me.rainbow"];

const create_account = async (id: WalletId) => {
    const metamask = createWallet(id); // pass the wallet id
    let account = await metamask.connect({ client });
    return account
}

export async function get_wallet_id(): Promise<string> {
    //export const get_wallet_id: () => Promise<WalletId> = async () => {
    for (let i = 0; i < supported_wallets.length; i++) {
        let wallet: WalletId = supported_wallets[i];
        if (injectedProvider(wallet)) {
            console.log("detected wallet: ", wallet)
            return wallet
            //return create_account(wallet)
        }
    }
    return ""
}

export const claim2 = (contract: ContractOptions, address: string, token_id: bigint, quantity: bigint, currency: string, price_per_token: bigint, allow_list_proof: any, data: string) => {
    const tx = prepareContractCall({
        contract,
        method:
            "function claim(address _receiver, uint256 _tokenId,  uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[],uint256,uint256,address) _allowlistProof, bytes _data) public",
        params: [address, token_id, quantity, currency, price_per_token, allow_list_proof, data]
    } as any);
    return tx
}