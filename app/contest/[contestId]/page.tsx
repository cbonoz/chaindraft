"use client"

import BasicCard from "@/components/basic-card"
import { ContestMetadata, SchemaEntry } from "@/lib/types"
import { useEffect, useRef, useState } from "react"

import PlayerDraft from "@/components/player-draft"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { getContestInfo } from "@/lib/contract/commands"
import LineupResults from "@/components/lineup-results"

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

			// if (contractData.attestationId) {
			// 	const res = await getAttestation(contractData.attestationId)
			// 	console.log("getAttestation", res)
			// }
		} catch (error) {
			console.log("error reading contract", error)
			setError(error)
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

	const invalid = !loading && !data
	const cancelled = data?.cancelled !== true
	const showDraft = Boolean(
		cancelled && data?.closeTime && data?.closeTime > Date.now()
	)
	const showLineups = Boolean(data?.closeTime && data?.closeTime < Date.now())

	const getTitle = () => {
		if (invalid || error) {
			return (
				<span>
					<span className="text-red-500">Error finding contest</span>
				</span>
			)
		}
		if (showDraft) {
			return data?.name || "Fantasy Contest"
		}
		return "Fantasy Contest"
	}

	return (
		// center align
		<div className="flex flex-col items-center justify-center mt-8">
			<BasicCard
				title={getTitle()}
				// description="Find and verify a fantasy contest using your wallet."
			>
				{invalid && (
					<div>
						<p>
							This contract may not exist or may be on another network, double
							check your currently connected network
						</p>
					</div>
				)}

				{cancelled && !invalid && !showDraft && !showLineups && (
					<div>
						<p>This contest has been cancelled</p>
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
