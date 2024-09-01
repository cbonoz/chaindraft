// hooks/useWeb3Auth.js

import { useState, useEffect } from "react"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"

import { ethers } from "ethers"
import Error from "next/error"
import { NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID } from "@/lib/constants"

// Define the providers you want to support (e.g., MetaMask, WalletConnect)
const chainConfig = {
	chainNamespace: CHAIN_NAMESPACES.EIP155,
	chainId: "0x7a31c7",
	rpcTarget: "https://api.helium.fhenix.zone",
	displayName: "Fhenix Helium",
	blockExplorerUrl: "https://explorer.helium.fhenix.zone",
	ticker: "tFHE",
	tickerName: "tFHE",
	logo: "https://img.cryptorank.io/coins/fhenix1695737384486.png",
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
	config: { chainConfig: chainConfig },
})

const useWeb3Auth = () => {
	const [provider, setProvider] = useState<any>(null)
	const [signer, setSigner] = useState(null)
	const [address, setAddress] = useState(null)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (provider) {
			const initializeSigner = async () => {
				try {
					const _signer = provider.getSigner()
					setSigner(_signer)
					const _address = await _signer.getAddress()
					setAddress(_address)
				} catch (err: any) {
					setError(err.message)
				}
			}
			initializeSigner()
		}
	}, [provider])

	const connectWallet = async () => {
		try {
			//Initialize within your constructor
			const web3auth = new Web3Auth({
				clientId: NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
				web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
				privateKeyProvider,
			})

			await web3auth.initModal()
			const _provider = await web3auth.connect()
			const ethersProvider = new ethers.providers.Web3Provider(_provider)
			setProvider(ethersProvider)
		} catch (err: any) {
			setError(err.message)
		}
	}

	const disconnectWallet = async () => {
		try {
			if (provider?.provider?.disconnect) {
				await provider.provider.disconnect()
			}
			setProvider(null)
			setSigner(null)
			setAddress(null)
		} catch (err: any) {
			setError(err.message)
		}
	}

	return {
		provider,
		signer,
		address,
		error,
		connectWallet,
		disconnectWallet,
	}
}

export default useWeb3Auth
