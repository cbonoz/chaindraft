// hooks/useWeb3Auth.js

import { useState, useEffect } from "react"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"

import { ethers } from "ethers"
import Error from "next/error"
import { NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID } from "@/lib/constants"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { CHAIN_OPTIONS } from "@/lib/chains"

import { MetamaskAdapter } from "@web3auth/metamask-adapter"

const useWeb3Auth = () => {
	const [provider, setProvider] = useState<any>(null)
	const [signer, setSigner] = useState(null)
	const [address, setAddress] = useState(null)
	const [activeChain, setActiveChain] = useState(CHAIN_OPTIONS[0])
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
			const privateKeyProvider = new EthereumPrivateKeyProvider({
				config: { chainConfig: activeChain },
			})
			//Initialize within your constructor
			const web3auth = new Web3Auth({
				clientId: NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
				web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
				privateKeyProvider,
			})
			const metamaskAdapter = new MetamaskAdapter({
				clientId: NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
				web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
				chainConfig: activeChain as any,
			})
			web3auth.configureAdapter(metamaskAdapter)

			await web3auth.initModal()
			const _provider = await web3auth.connect()
			const ethersProvider = new ethers.BrowserProvider(_provider as any)
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
		setActiveChain,
		activeChain,
	}
}

export default useWeb3Auth
