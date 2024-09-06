"use client"
import { abbreviate } from "@/lib/utils"
import { Button } from "../ui/button"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"

function ConnectWallet() {
	const { signer, address, connectWallet, disconnectWallet } =
		useWeb3AuthContext()

	if (!!signer) {
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
			className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded cursor-pointer pointer"
			variant="secondary"
			onClick={() => {
				connectWallet()
			}}
		>
			Connect wallet
		</Button>
	)
}

export default ConnectWallet
