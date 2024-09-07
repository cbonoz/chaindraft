"use client"

import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { ContestMetadata } from "@/lib/types"
import { getAttestationUrl, isEmpty } from "@/lib/utils"
import Link from "next/link"

type Props = {
	contestId: string
	contestData: ContestMetadata
}

const LineupResults = ({ contestId, contestData }: Props) => {
	const { address } = useWeb3AuthContext()

	const winner = contestData?.winner
	const isOwner = address === contestData?.owner
	const lineups = contestData?.lineups || []

	const winnerLineup = lineups.find((l) => l.owner === winner)

	const showDeclareWinner = !winner && isOwner

	if (showDeclareWinner) {
		return (
			<div>
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
			<h2 className="text-2xl font-bold">Lineups</h2>

			{lineups.length === 0 && <p>No lineups submitted</p>}
			{!winnerLineup && !isEmpty(lineups) && (
				<div>
					<div>Active lineups</div>
					TODO
					{/* TODO: iterate over lineups and enable chat */}
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
