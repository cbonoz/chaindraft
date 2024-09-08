"use client"

import BasicCard from "@/components/basic-card"
import { ContestMetadata, SchemaEntry } from "@/lib/types"
import { useEffect, useRef, useState } from "react"

import PlayerDraft from "@/components/player-draft"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { getContestInfo } from "@/lib/contract/commands"
import LineupResults from "@/components/lineup-results"
import {
	formatDate,
	getReadableError,
	isEmpty,
	isParticipant,
} from "@/lib/utils"
import { AlertCircle } from "lucide-react"
import { ethers } from "ethers"

interface Params {
	contestId: string
}

export default function ContestPage({ params }: { params: Params }) {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<ContestMetadata | undefined>()
	const [error, setError] = useState<any>(null)
	const ref = useRef(null)

	const { contestId } = params

	const {
		activeChain: currentChain,
		address,
		signer,
		provider,
	} = useWeb3AuthContext()

	const submissionsClosed = data?.closeTime && data?.closeTime < Date.now()

	async function fetchData() {
		if (!signer || !currentChain) {
			return
		}

		setLoading(true)
		try {
			const contractData: ContestMetadata = await getContestInfo(
				signer,
				currentChain?.chainId,
				parseInt(contestId)
			)
			// convert balance and validatedAt to number from bigint
			console.log("contractData", contractData)
			setData(contractData)
		} catch (error) {
			console.log("error reading contract", error)
			setError(getReadableError(error))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (address) {
			fetchData()
		}
	}, [address])

	if (loading) {
		return <div>Loading...</div>
	}

	if (!address) {
		return <div>Please connect your wallet</div>
	}

	const invalid = !loading && isEmpty(data?.name)
	const cancelled = data?.cancelled === true
	const showLineups = isParticipant(data, address) && !cancelled
	const showDraft = Boolean(
		!cancelled &&
			data?.closeTime &&
			data?.closeTime > Date.now() &&
			!showLineups
	)

	const getTitle = () => {
		const contestName = data?.name || "Fantasy Contest"
		if (invalid || error) {
			return (
				<span>
					<span className="text-red-500">Error finding contest</span>
				</span>
			)
		} else if (showDraft) {
			return `Draft your lineup for: ${contestName}`
		} else if (showLineups) {
			return `Lineups for ${contestName}`
		}
		return contestName
	}

	const entryFee = ethers.formatEther(ethers.getBigInt(data?.entryFee || 0))

	return (
		// center align
		<div className="flex flex-col items-center justify-center m-8 px-4">
			<BasicCard title={getTitle()}>
				{invalid && (
					<div>
						<p>
							This contest page may not exist or may be on another network,
							double check your currently connected network.
						</p>
					</div>
				)}

				{cancelled && !invalid && (
					<div>
						<span className="text-red-500 text-xl flex flex-row">
							<AlertCircle size={24}></AlertCircle>
							<span className="ml-1">This contest has been cancelled.</span>
						</span>
					</div>
				)}

				{!invalid && !submissionsClosed && (
					<div>
						<div className="mt-2">
							Contest start date: {formatDate(Number(data?.closeTime), true)}
						</div>
						{entryFee > 0 && (
							<div>
								Entry fee: {entryFee} {currentChain?.ticker}
							</div>
						)}
					</div>
				)}

				{showDraft && data && (
					<div>
						<PlayerDraft contestId={contestId} contestData={data} />
					</div>
				)}

				{showLineups && data && (
					<div>
						<LineupResults contestId={contestId} contestData={data} />
					</div>
				)}

				{error && <div className="text-red-500">{error.message}</div>}
			</BasicCard>
		</div>
	)
}
