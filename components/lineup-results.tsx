"use client"

import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { ContestMetadata } from "@/lib/types"
import {
	formatDate,
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
import { Separator } from "@radix-ui/react-select"

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
			window?.location?.reload()
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
			window?.location?.reload()
		} catch (error) {
			console.error("Error cancelling contest", error)
			setError(getReadableError(error))
		} finally {
			setLoading(false)
		}
	}

	const notStartedAndNotOwner = !hasStarted && !isOwner

	return (
		<div className="min-w-[800px] max-w-[1200px]">
			{hasStarted && !winnerLineup && (
				<div className="font-bold">Submissions have closed</div>
			)}
			{cancelled && <div>This contest has been cancelled</div>}
			{lineups.length === 0 && <p>No lineups submitted</p>}
			{!winnerLineup && !isEmpty(lineups) && (
				<div>
					<div className="text-2xl my-4">Submitted lineups</div>
					{notStartedAndNotOwner && (
						<div className="text-sm italic">
							Submissions have not been closed yet. Other lineups will be
							revealed after the contest starts.
						</div>
					)}
					{lineups.map((lineup, i) => (
						<div>
							<hr className="my-4" />
							<div className="text-lg">Lineup {i + 1}</div>
							<DisplayLineup
								key={lineup.owner}
								lineup={lineup}
								contestData={contestData}
								contestId={contestId}
								showDeclareWinner={showDeclareWinner}
							/>
						</div>
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

			{isOwner && !hasStarted && !cancelled && (
				<div className="mt-4">
					<div className="text-med mb-2 border-top">
						As the contest owner, you can:
					</div>
					<div>
						<Button
							variant={"secondary"}
							size={"lg"}
							onClick={start}
							disabled={loading}
						>
							Close submissions
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
						<div className="text-sm italics italic">
							Note submissions will close automatically when the contest starts.
						</div>
					</div>
				</div>
			)}
			{error && <div className="text-red-500 mt-4">{error}</div>}
		</div>
	)
}

export default LineupResults
