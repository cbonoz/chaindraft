"use client"

import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { ContestMetadata } from "@/lib/types"
import { getAttestationUrl, getReadableError, isEmpty } from "@/lib/utils"
import Link from "next/link"
import { Button } from "./ui/button"
import { useState } from "react"
import DisplayLineup from "./display-lineup"

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

	const showDeclareWinner = !winner && isOwner

	async function startContest() {
		setLoading(true)
		try {
			// startContest(contestId)
		} catch (error) {
			console.error("Error starting contest", error)
			setError(getReadableError(error))
		} finally {
			setLoading(false)
		}
	}

	async function cancelContest() {
		setLoading(true)
		try {
			// startContest(contestId)
		} catch (error) {
			console.error("Error starting contest", error)
			setError(getReadableError(error))
		} finally {
			setLoading(false)
		}
	}

	if (showDeclareWinner) {
		return (
			<div>
				<div>As the owner of this contest, you can</div>
				<h2 className="text-2xl font-bold">Declare winner</h2>
				<p>Declare the winner of this contest. This action is irreversible.</p>
				<button
					className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded cursor-pointer pointer"
					onClick={() => {
						// declareWinner(contestId)
					}}
				>
					Declare winner
				</button>
			</div>
		)
	}

	return (
		<div>
			{isOwner && (
				<div>
					<div>
						<p>You are the owner of this contest</p>
						{!hasStarted && !cancelled && (
							<div>
								<Button
									variant={"secondary"}
									size={"lg"}
									onClick={startContest}
								>
									Freeze contest
								</Button>
								&nbsp;
								<Button
									size={"lg"}
									variant={"destructive"}
									onClick={cancelContest}
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
					<div>Active lineups</div>
					{lineups.map((lineup) => (
						<DisplayLineup key={lineup.owner} lineup={lineup} />
					))}
				</div>
			)}

			{winnerLineup && (
				<div>
					<h2 className="text-2xl font-bold">Winner</h2>
					<div className="my-2">
						Winner: {winnerLineup.owner} - Attestation:{" "}
						{winnerLineup.attestationId}
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
