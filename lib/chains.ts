import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { CustomChainConfig } from "@web3auth/base"

// Define the providers you want to support (e.g., MetaMask, WalletConnect)
const FHENIX_TESTNET: CustomChainConfig = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: "0x7a31c7",
	rpcTarget: "https://api.helium.fhenix.zone",
	displayName: "Fhenix Helium",
	blockExplorerUrl: "https://explorer.helium.fhenix.zone",
	ticker: "tFHE",
	tickerName: "tFHE",
	logo: "https://img.cryptorank.io/coins/fhenix1695737384486.png",
}

export const CHAIN_OPTIONS = [FHENIX_TESTNET]
