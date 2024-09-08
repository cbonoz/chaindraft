import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { CustomChainConfig } from "@web3auth/base"
import { isEmpty } from "./utils"

// Define the providers you want to support (e.g., MetaMask, WalletConnect)
export const FHENIX_TESTNET: CustomChainConfig = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: "0x7a31c7",
	rpcTarget: "https://api.helium.fhenix.zone",
	displayName: "Fhenix Helium",
	blockExplorerUrl: "https://explorer.helium.fhenix.zone",
	ticker: "tFHE",
	tickerName: "tFHE",
	logo: "https://img.cryptorank.io/coins/fhenix1695737384486.png",
}

export const CHILIZ_TESTNET: CustomChainConfig = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: "0x15b32",
	rpcTarget: "https://spicy-rpc.chiliz.com",
	displayName: "Chiliz Spicy Testnet",
	blockExplorerUrl: "https://testnet.chiliscan.com",
	ticker: "CHZ",
	tickerName: "CHZ",
	logo: "https://icons.llamao.fi/icons/chains/rsz_chiliz.jpg",
}

export const MORPH_TESTNET: CustomChainConfig = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: "0xAFA",
	rpcTarget: "https://rpc-quicknode-holesky.morphl2.io",
	displayName: "Morph Testnet",
	blockExplorerUrl: "https://explorer-holesky.morphl2.io",
	ticker: "ETH",
	tickerName: "ETH",
	logo: "https://morph.ghost.io/content/images/2024/05/Logo--Morph-Green-.png",
}

export const CONTRACT_ADDRESS_MAP: Record<string, string | undefined> = {
	[CHILIZ_TESTNET.chainId]: process.env.NEXT_PUBLIC_CHILIZ_ADDRESS,
	[FHENIX_TESTNET.chainId]: process.env.NEXT_PUBLIC_FHENIX_ADDRESS,
	[MORPH_TESTNET.chainId]: process.env.NEXT_PUBLIC_MORPH_ADDRESS,
}

// add option if address is set in map
export const CHAIN_OPTIONS = [
	CHILIZ_TESTNET,
	FHENIX_TESTNET,
	MORPH_TESTNET,
].filter((chain) => !isEmpty(CONTRACT_ADDRESS_MAP[chain.chainId]))
