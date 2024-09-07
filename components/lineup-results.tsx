"use client"

import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { ContestMetadata } from "@/lib/types"
import {
	getAttestationUrl,
	getExplorerUrl,
	getReadableError,
	isEmpty,
	isZeroAddress,
} from "@/lib/utils"
import Link from "next/link"
import { Button } from "./ui/button"
import { useState } from "react"
import DisplayLineup from "./display-lineup"
import { cancelContest, startContest } from "@/lib/contract/commands"

type Props = {
	contestId: string
	contestData: ContestMetadata
}

const LineupResults = ({ contestId, contestData }: Props) => {
	const { address, signer, activeChain } = useWeb3AuthContext()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const chainId = activeChain?.chainId

	const winner = contestData?.winner
	const isOwner = address === contestData?.owner
	const lineups = contestData?.lineups || []
	const cancelled = contestData?.cancelled === true
	const hasStarted = contestData?.closeTime < Date.now()

	const winnerLineup = lineups.find((l) => l.owner === winner)

	const showDeclareWinner = isZeroAddress(winner) && isOwner && hasStarted

	async function start() {
		if (!signer || !chainId) {
			setError("Please connect your wallet")
			return
		}
		setLoading(true)

		try {
			await startContest(signer, chainId, contestId)
		} catch (error) {
			console.error("Error starting contest", error)
			setError(getReadableError(error))
		} finally {
			setLoading(false)
		}
	}

	async function cancel() {
		if (!chainId || !signer) {
			setError("Please connect your wallet")
			return
		}

		setLoading(true)
		try {
			await cancelContest(signer, chainId, contestId)
		} catch (error) {
			console.error("Error cancelling contest", error)
			setError(getReadableError(error))
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-w-[800px] max-w-[1200px]">
			{isOwner && (
				<div>
					<div>
						{!hasStarted && !cancelled && (
							<div>
								<Button
									variant={"secondary"}
									size={"lg"}
									onClick={start}
									disabled={loading}
								>
									Freeze contest
								</Button>
								&nbsp;
								<Button
									size={"lg"}
									variant={"destructive"}
									onClick={cancel}
									disabled={loading}
								>
									Cancel contest
								</Button>
							</div>
						)}
					</div>

					{error && <div className="text-red-500 mt-4">{error}</div>}
				</div>
			)}

			{lineups.length === 0 && <p>No lineups submitted</p>}
			{!winnerLineup && !isEmpty(lineups) && (
				<div>
					<div className="text-2xl mt-4">Active lineups</div>
					{lineups.map((lineup) => (
						<DisplayLineup
							key={lineup.owner}
							lineup={lineup}
							contestData={contestData}
							contestId={contestId}
							showDeclareWinner={showDeclareWinner}
						/>
					))}
				</div>
			)}

			{winnerLineup && (
				<div>
					<h2 className="text-2xl font-bold text-green-500">
						This contest has ended!
					</h2>
					<div className="my-2">
						Winner:{" "}
						<Link href={getExplorerUrl(winnerLineup.owner, activeChain)}>
							{winnerLineup.owner}
						</Link>
						&nbsp;- Attestation: {winnerLineup.attestationId}
					</div>
					<Link
						className="text-blue-500 hover:underline"
						rel="noopener noreferrer"
						target="_blank"
						href={getAttestationUrl(winnerLineup.attestationId)}
					>
						View proof of human submission
					</Link>
				</div>
			)}
		</div>
	)
}

export default LineupResults
