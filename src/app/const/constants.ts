import { baseSepolia, Chain } from "thirdweb/chains";

export const factoryAddress: string = `${process.env.NEXT_PUBLIC_FACTORY_ADDRESS}`;
export const TWApiKey: string = `${process.env.NEXT_PUBLIC_SECRET_KEY}`;
export const activeChain: Chain = baseSepolia;

export const nftDropAddress: string = `${process.env.NEXT_PUBLIC_NFT_DROP_ADDRESS}`;
export const clientId: string = `${process.env.NEXT_PUBLIC_CLIENT_ID}`;
export const secretKey: string = `${process.env.NEXT_PUBLIC_SECRET_KEY}`;
export const implementation: string = `${process.env.NEXT_PUBLIC_IMPLEMENTATION}`;
export const entryPoint: string = `${process.env.NEXT_PUBLIC_ENTRY}`;
export const idNFT: string = `${process.env.NEXT_PUBLIC_ID_NFT}`;