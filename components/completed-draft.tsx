"use client"

import { ContestMetadata, Player, SchemaEntry } from "@/lib/types"
import React, { useState } from "react"
import PlayerCard from "./player-card"
import Image from "next/image"
import { POSITIONS } from "@/lib/constants"
import { Button } from "./ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import ReactSignatureCanvas from "react-signature-canvas"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { submitLineup } from "@/lib/contract/commands"
import { getReadableError, isZeroAddress } from "@/lib/utils"
import { createAttestation } from "@/lib/ethsign"
import { createIdentity } from "@/lib/playerchat/xmtp"

interface Props {
	draftedPlayers: Record<string, Player | null>
	reset: () => void
	contestId: string
	contestData: ContestMetadata
}

const CompletedDraft = ({
	draftedPlayers,
	reset,
	contestId,
	contestData,
}: Props) => {
	const [loading, setLoading] = useState(false)
	const [passcode, setPasscode] = useState("")
	const [result, setResult] = useState<any>(null)
	const [error, setError] = useState<any>(null)
	const ref = React.useRef<any>()
	const { signer, provider, activeChain } = useWeb3AuthContext()

	const isOwner = contestData.owner === signer?.address

	const players = Object.values(draftedPlayers).filter(
		(player) => player !== null
	)

	const chainId = activeChain?.chainId

	async function onSubmit() {
		setError(null)
		console.log("Draft submitted", contestId, draftedPlayers)
		if (!signer || !chainId) {
			setError(
				"No signer or chainId - try refreshing the page or logging back in"
			)
			return
		}
		setLoading(true)

		let signature = ""
		if (ref?.current) {
			const signatureData = (ref.current as any).toDataURL() || ""
			console.log("signatureData", signatureData)
		}

		try {
			await createIdentity(signer)

			const players = Object.values(draftedPlayers).filter(
				(player) => player !== null
			)

			const playerIds = players.map((player) => player?.smart_id)
			const schemaEntry: SchemaEntry = {
				name: contestData.name,
				data: JSON.stringify({ playerIds }),
				timestamp: Date.now().toString(),
				signature,
			}

			const attestation = await createAttestation(signer, schemaEntry)
			const res = await submitLineup(
				signer,
				activeChain?.chainId,
				contestId,
				players,
				passcode,
				attestation.attestationId,
				contestData.entryFee || 0
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
		<div className="justify-center max-w-[1200px] mx-4 px-4">
			{/* <Image
				src="/logo.png"
				alt="chaindraft"
				className="my-4"
				width={200}
				height={100}
			/> */}
			<div className="text-green-500 text-2xl font-bold mt-4">Nice draft!</div>
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
				<div className="text-med font-bold">Sign here for verification</div>
				<ReactSignatureCanvas ref={ref} />
			</div>
			{!isZeroAddress(contestData?.passcodeHash) && (
				<div>
					<input
						type="text"
						value={passcode}
						onChange={(e) => setPasscode(e.target.value)}
						placeholder="Enter passcode"
						className="border p-2"
					/>
				</div>
			)}
			{result?.success && (
				<div>
					<div className="text-green-500 mt-4">{result.message}</div>
					{/* // View lineup by refresh */}
					<Button
						onClick={() => {
							window.location.reload()
						}}
						className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
					>
						View Lineup
					</Button>
				</div>
			)}
			{!result?.success && (
				<div>
					<Button
						onClick={onSubmit}
						disabled={loading}
						className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded"
					>
						Submit Draft
						{loading && <ReloadIcon className="animate-spin ml-1" />}
					</Button>
				</div>
			)}
			{/* {isOwner && (
				<div>
					<Button
						onClick={reset}
						disabled={loading}
						className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
					>
						Reset Draft
					</Button>
				</div>
			)} */}
			{error && <div className="text-red-500 mt-4">{error}</div>}
		</div>
	)
}
export default CompletedDraft
