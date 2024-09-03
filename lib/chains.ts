import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { CustomChainConfig } from "@web3auth/base"

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
	displayName: "Chiiliz Testnet",
	blockExplorerUrl: "https://testnet.chiliscan.com",
	ticker: "CHZ",
	tickerName: "CHZ",
	logo: "https://icons.llamao.fi/icons/chains/rsz_chiliz.jpg",
}

export const CHAIN_OPTIONS = [CHILIZ_TESTNET, FHENIX_TESTNET]

export const CONTRACT_ADDRESS_MAP: Record<string, string | undefined> = {
	[CHILIZ_TESTNET.chainId]: process.env.NEXT_PUBLIC_CHILIZ_ADDRESS,
	[FHENIX_TESTNET.chainId]: process.env.NEXT_PUBLIC_FHENIX_ADDRESS,
}
