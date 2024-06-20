import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract } from "ethers";
import {
    implementation,
    nftDropAddress,
    factoryAddress,
    TWApiKey,
    clientId,
    entryPoint
} from "../const/constants";
import { ethers } from "ethers";
import { WalletOptions, SmartWallet } from "@thirdweb-dev/wallets";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";

export default function newSmartWallet(token: NFT) {
    //Smart Wallet config object
    const activeChain = BaseSepoliaTestnet
    console.log("newSmartWallet")
    console.log(factoryAddress, implementation, activeChain.chainId, nftDropAddress, token.metadata.id)

    const config = {
        chain: activeChain, // the chain where your smart wallet will be or is deployed
        factoryAddress: factoryAddress, // your own deployed account factory address
        clientId: clientId, // Use client id if using on the client side, get it from dashboard settings
        secretKey: TWApiKey, // Use secret key if using on the server, get it from dashboard settings
        gasless: true, // enable or disable gasless transactions
        entryPointAddress: entryPoint,// adding this made an error related to failure to load contract go away
        factoryInfo: {
            createAccount: async (
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                const account = factory.prepare('createAccount', [
                    implementation,
                    activeChain.chainId,
                    nftDropAddress,
                    token.metadata.id,
                    0,
                    ethers.utils.toUtf8Bytes('')
                ])
                console.log("here", account)
                return account
            }, // the factory method to call to create an account
            getAccountAddress: async (
                factory: SmartContract<BaseContract>,
                owner: string
            ) => {
                return factory.call("account", [
                    implementation,
                    activeChain.chainId,
                    nftDropAddress,
                    token.metadata.id,
                    0,
                ])
            }, // the factory method to call to get the account address
        },
    };

    return new SmartWallet(config)
}