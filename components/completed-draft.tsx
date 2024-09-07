"use client"

import { Player } from "@/lib/types"
import React, { useState } from "react"
import PlayerCard from "./player-card"
import Image from "next/image"
import { POSITIONS } from "@/lib/constants"
import { Button } from "./ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import ReactSignatureCanvas from "react-signature-canvas"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { submitLineup } from "@/lib/contract/commands"
import { getReadableError } from "@/lib/utils"

interface Props {
	draftedPlayers: Record<string, Player | null>
	reset: () => void
	contestId: string
	passcodeHash?: string
}

const CompletedDraft = ({
	draftedPlayers,
	reset,
	contestId,
	passcodeHash,
}: Props) => {
	const [loading, setLoading] = useState(false)
	const [passcode, setPasscode] = useState("")
	const [result, setResult] = useState<any>(null)
	const [error, setError] = useState<any>(null)
	const ref = React.useRef<any>()
	const { signer, activeChain } = useWeb3AuthContext()

	const players = Object.values(draftedPlayers).filter(
		(player) => player !== null
	)

	const chainId = activeChain?.chainId

	async function onSubmit() {
		console.log("Draft submitted", contestId, draftedPlayers)
		if (!signer || !chainId) {
			setError(
				"No signer or chainId - try refreshing the page or logging back in"
			)
			return
		}
		setLoading(true)
		try {
			const players = Object.values(draftedPlayers).filter(
				(player) => player !== null
			)
			await submitLineup(
				signer,
				activeChain?.chainId,
				contestId,
				players,
				passcode
			)
			setResult({
				success: true,
				message: "Draft submitted successfully!",
			})
		} catch (err: any) {
			console.error(err)
			setError(getReadableError(err))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="justify-center max-w-[1200px]">
			{/* <Image
				src="/logo.png"
				alt="chaindraft"
				className="my-4"
				width={200}
				height={100}
			/> */}
			<div className="text-green-500 text-2xl font-bold">Nice draft!</div>
			<div className="flex flex-row gap-4 max-w-[1200px]">
				{players.map((player, index) => (
					<div className="gap-4">
						<PlayerCard
							key={index}
							player={player}
							position={POSITIONS[index]}
						/>
					</div>
				))}
			</div>
			<div className="my-4 border w-[325px] p-1">
				<div className="text-med font-bold">Sign here</div>
				<ReactSignatureCanvas ref={ref} />
			</div>

			<div>
				<Button
					onClick={onSubmit}
					disabled={loading}
					className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
				>
					Submit Draft
					{loading && <ReloadIcon className="animate-spin ml-1" />}
				</Button>
			</div>
			<div>
				<Button
					onClick={reset}
					disabled={loading}
					className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
				>
					Reset Draft
				</Button>
			</div>
			{error && <div className="text-red-500 mt-4">{error}</div>}
		</div>
	)
}
export default CompletedDraft
