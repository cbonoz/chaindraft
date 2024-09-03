"use client"

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { CHAIN_OPTIONS } from "@/lib/chains"

export function SwitchNetwork() {
	const { activeChain, setActiveChain } = useWeb3AuthContext()

	return (
		<Select
			onValueChange={(cid: string) => {
				const newChain = CHAIN_OPTIONS.find((c) => c.chainId === cid)
				if (newChain) {
					setActiveChain(newChain)
				}
			}}
			value={activeChain?.chainId || CHAIN_OPTIONS[0].chainId}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Select network" />
			</SelectTrigger>

			<SelectContent>
				<SelectGroup>
					{CHAIN_OPTIONS.map((chain) => (
						<SelectItem key={chain.chainId} value={chain.chainId + ""}>
							{chain.displayName}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
