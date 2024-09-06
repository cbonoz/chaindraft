import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { requireContractAddress } from "@/lib/contract/commands"
import { getExplorerUrl } from "@/lib/utils"
import Link from "next/link"

const ViewContract = () => {
	const { activeChain: currentChain } = useWeb3AuthContext()
	const chainId = currentChain?.chainId

	if (!chainId) {
		return null
	}

	return (
		<div className="text-sm text-bold">
			<Link
				className="text-green-500 underline hover:text-green-700"
				rel="noopener noreferrer"
				target="_blank"
				href={getExplorerUrl(requireContractAddress(chainId), currentChain)}
			>
				View contract on {currentChain?.displayName || "explorer"}
			</Link>
		</div>
	)
}

export default ViewContract
