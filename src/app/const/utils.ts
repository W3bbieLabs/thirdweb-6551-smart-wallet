import {
    prepareContractCall,
    getContract,
    createThirdwebClient,
} from "thirdweb";
import { ContractOptions, readContract, sendTransaction } from "thirdweb";
import { createWallet, injectedProvider } from "thirdweb/wallets";
//import { client } from "./constants";
import { WalletId } from "thirdweb/wallets";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { SmartWalletOptions } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { arrayify } from "ethers/lib/utils";
import {
    implementation,
    nftDropAddress,
    idNFT,
    factoryAddress,
    entryPoint,
} from "./constants";
import { smartWallet } from "thirdweb/wallets";
import { clientId, allow_list, ALLOW_LIST_TYPE } from "./constants";
import { Account } from "thirdweb/wallets";
import { ThirdwebContract } from "thirdweb";
const NFT_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS;



export const truncate = (address: string, chars: number) => {
    return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
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
            //console.log("detected wallet: ", wallet)
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


export const fetchNFTs = async (walletAddress: string, contract: Readonly<ContractOptions<[]>>) => {
    const ownedNFTs = await getOwnedNFTs({
        contract,
        start: 0,
        count: 10,
        address: walletAddress,
    });
    //console.log("Owned NFTs:", ownedNFTs);
    return ownedNFTs
};

export const newSmartWallet = () => {
    //console.log("token_bound_address", token_bound_address)
    const config: SmartWalletOptions = {
        chain: base,
        sponsorGas: false,
        factoryAddress: factoryAddress,
        overrides: {
            entrypointAddress: entryPoint,
            predictAddress: async (
                factoryContract: ThirdwebContract,
            ) => {
                console.log("factory contract", factoryContract)
                return await factoryContract.address;
            }
        },
        gasless: false,
    };

    return smartWallet(config);
};


export const get_tba_owner = async (deployed_tba_contract: Readonly<ContractOptions<[]>>) => {
    const data = await readContract({
        contract: deployed_tba_contract,
        method: "function owner() view returns (address)",
        params: []
    })
    return data
    //console.log(data)
}


/*
export const init_tba = async (account: Account, contract: Readonly<ContractOptions<[]>>) => {
    const transaction = await prepareContractCall({
        contract,
        method: "function initialize(address _defaultAdmin, bytes _data)",
        params: ["0x4Cb7FA20eB4007506cD4196B8a399b03669Ca54a", "0x"]
    });

    const { transactionHash } = await sendTransaction({
        transaction,
        account
    });

    console.log(transactionHash)
}
*/
export const create_tba_account = async (account: Account, nft: any, registry_contract: Readonly<ContractOptions<[]>>, chain_id: bigint) => {
    let { id } = nft;
    let initData = arrayify("0x8129fc1c")
    console.log("preparing contract call", initData)
    const tx = await prepareContractCall({
        contract: registry_contract,
        method:
            "function createAccount( address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt, bytes initData) view returns (address)",
        params: [implementation, chain_id, nftDropAddress, BigInt(id), 0n, "0x"],
    });
    console.log(implementation, chain_id, nftDropAddress, BigInt(id), 0n, "0x")

    //0x452D6699dA2D89627Baa12d2cE9A32A2479398A0 8453n 0xF1316D7eC6465BF25d1f918037043D0420270900 3n 0n 0x8129fc1c
    console.log("tx", tx)

    const transactionResult = await sendTransaction({
        transaction: tx,
        account: account!,
    });

    console.log("tx", tx, "tx result", transactionResult);
    return transactionResult;
};

export const get_tba_address = async (nft: any, registry_contract: Readonly<ContractOptions<[]>>, chain_id: bigint) => {
    let { id } = nft;
    const tba_address = await readContract({
        contract: registry_contract,
        method:
            "function account( address implementation, uint256 chainId, address tokenContract, uint256 tokenId, uint256 salt) view returns (address)",
        params: [implementation, chain_id, nftDropAddress, BigInt(id), 0n],
    });
    return tba_address;
};

export const claim = async (
    contract: Readonly<ContractOptions<[]>>,
    account: Account,
    tba_address: string,
    token_id: BigInt,
    quantity: BigInt,
    currency: string,
    _allow_list: ALLOW_LIST_TYPE,
    data: String
) => {
    const tx = prepareContractCall({
        contract: contract,
        method:
            "function claim(address _receiver, uint256 _tokenId,  uint256 _quantity, address _currency, uint256 _pricePerToken, (bytes32[],uint256,uint256,address) _allowlistProof, bytes _data) public",
        params: [tba_address, token_id, quantity, currency, 0n, allow_list, data],
    } as any);

    const transactionResult = await sendTransaction({
        transaction: tx,
        account: account!,
    });

    return transactionResult;
};

export const get_generic_contract = async (address: string) => {
    const _contract = getContract({
        client,
        chain: base,
        address: address,
    });

    return _contract
}

export const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
});

export const bounded_token_contract = getContract({
    client,
    chain: base,
    address: NFT_COLLECTION_ADDRESS!,
});

export const registry_contract = getContract({
    client,
    chain: base,
    address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "",
});

export const implementation_contract = getContract({
    client,
    chain: base,
    address: process.env.NEXT_PUBLIC_IMPLEMENTATION || "",
});



export const pgc_1155_id_contract = getContract({
    client,
    chain: base,
    address: process.env.NEXT_PUBLIC_ID_NFT || "", // deploy a drop contract from thirdweb.com/explore
});

export const active_chain_id: bigint = BigInt(process.env.NEXT_PUBLIC_CHAIN_ID!);


export const wallets = [
    createWallet("com.coinbase.wallet"),
    createWallet("io.metamask"),
];
