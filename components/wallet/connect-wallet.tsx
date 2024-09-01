"use client"
import { useAccount } from "wagmi"
import { WalletOptions } from "./wallet-options"
import { abbreviate } from "@/lib/utils"
import { Button } from "../ui/button"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"

function ConnectWallet() {
	const { provider, address, connectWallet, disconnectWallet } =
		useWeb3AuthContext()

	if (provider) {
		return (
			<span>
				{abbreviate(address)}{" "}
				<Button
					onClick={() => {
						disconnectWallet()
					}}
				>
					Disconnect
				</Button>
			</span>
		)
	}
	return (
		<Button
			onClick={() => {
				connectWallet()
			}}
		>
			Connect wallet
		</Button>
	)
}

export default ConnectWallet
