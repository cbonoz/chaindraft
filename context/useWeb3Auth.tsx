// hooks/useWeb3Auth.js

import { useState, useEffect } from "react"
import { Web3Auth } from "@web3auth/modal"
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base"
import { WALLET_ADAPTERS } from "@web3auth/base"

import { ethers } from "ethers"
import Error from "next/error"
import { NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID } from "@/lib/constants"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { CHAIN_OPTIONS } from "@/lib/chains"
import { CustomChainConfig } from "@web3auth/base"

import { MetamaskAdapter } from "@web3auth/metamask-adapter"
import { isEmpty } from "@/lib/utils"
const PREVIOUSLY_CONNECTED_KEY = "previouslyConnected"

const useWeb3Auth = () => {
	const [provider, setProvider] = useState<any>(null)
	const [web3Auth, setWeb3Auth] = useState<any>(null)
	const [signer, setSigner] = useState<any>(null)
	const [address, setAddress] = useState<string | null>(null)
	const [activeChain, setActiveChain] = useState<
		CustomChainConfig | undefined
	>()
	const [error, setError] = useState(null)

	useEffect(() => {
		if (activeChain) {
			connectWallet()
		}
	}, [activeChain])

	useEffect(() => {
		const previouslyConnectedChainId = localStorage.getItem(
			PREVIOUSLY_CONNECTED_KEY
		)
		if (previouslyConnectedChainId) {
			const chain = CHAIN_OPTIONS.find(
				(chain) => chain.chainId === previouslyConnectedChainId
			)
			if (chain) {
				setActiveChain(chain)
			}
		} else {
			setActiveChain(CHAIN_OPTIONS[0])
		}
	}, [])

	useEffect(() => {
		if (provider) {
			const initializeSigner = async () => {
				try {
					const ethersProvider = new ethers.BrowserProvider(provider)
					const _signer = await ethersProvider.getSigner()
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
		if (!activeChain) {
			return
		}
		try {
			const privateKeyProvider = new EthereumPrivateKeyProvider({
				config: { chainConfig: activeChain },
			})
			//Initialize within your constructor
			const web3 = new Web3Auth({
				clientId: NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
				web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
				privateKeyProvider,
			})
			const metamaskAdapter = new MetamaskAdapter({
				clientId: NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID, // Get your Client ID from Web3Auth Dashboard
				web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
				chainConfig: activeChain as any,
			})
			web3.configureAdapter(metamaskAdapter)

			await web3.initModal({
				modalConfig: {
					[WALLET_ADAPTERS.OPENLOGIN]: {
						label: "openlogin",
						showOnModal: false,
					},
				},
			})
			const previouslyConnectedChainId = localStorage.getItem(
				PREVIOUSLY_CONNECTED_KEY
			)
			if (!isEmpty(previouslyConnectedChainId)) {
				await web3.connect()
			}
			localStorage.setItem(PREVIOUSLY_CONNECTED_KEY, activeChain.chainId)
			setProvider(web3.provider)
			setWeb3Auth(web3)
		} catch (err: any) {
			setError(err.message)
		}
	}

	const disconnectWallet = async () => {
		try {
			await web3Auth?.logout()
			if (provider?.provider?.disconnect) {
				await provider.provider.disconnect()
			}
			localStorage?.removeItem(PREVIOUSLY_CONNECTED_KEY)
			setWeb3Auth(null)
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
