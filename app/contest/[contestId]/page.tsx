"use client"

import BasicCard from "@/components/basic-card"
import RenderObject from "@/components/render-object"
import { Button } from "@/components/ui/button"
import { APP_CONTRACT } from "@/lib/contract/metadata"
import { useEthersSigner } from "@/lib/get-signer"
import { ContestMetadata, SchemaEntry } from "@/lib/types"
import {
	abbreviate,
	formatCurrency,
	formatDate,
	getAttestationUrl,
	getExplorerUrl,
	getIpfsUrl,
} from "@/lib/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"

import { createAttestation, getAttestation } from "@/lib/ethsign"
import PlayerDraft from "@/components/player-draft"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { getContestInfo, requireContractAddress } from "@/lib/contract/commands"
import { CHAIN_OPTIONS, CHILIZ_TESTNET } from "@/lib/chains"

const RESULT_KEYS = [
	"name",
	"description",
	"recipientName",
	"recipientAddress",
	"owner",
	"network",
	"attestationId",
]

interface Params {
	contestId: string
}

export default function ContestPage({ params }: { params: Params }) {
	const [loading, setLoading] = useState(true)
	const [signLoading, setSignLoading] = useState(false)
	const [data, setData] = useState<ContestMetadata | undefined>()
	const [result, setResult] = useState<any>(null)
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

	async function signRequest() {
		if (!data) {
			alert("No data to sign - try another url")
			return
		}

		let signature = ""
		if (ref?.current) {
			const signatureData = (ref.current as any).toDataURL() || ""
			console.log("signatureData", signatureData)
		}

		setSignLoading(true)
		const d: ContestMetadata = data

		try {
			const schemaEntry: SchemaEntry = {
				name: d.name,
				lineup: d.name,
				timestamp: Date.now().toString(),
				signature,
				// signatureData,
			}

			const attestation = await createAttestation(signer, schemaEntry)
			// const attestation = { attestationId: '1234' }
			// await switchChain({ chainId })
			let res = {}
			console.log("created attestation", attestation)
			// const res = await writeContract(config, {
			// 	abi: APP_CONTRACT.abi,
			// 	address: contestId,
			// 	functionName: "validate",
			// 	args: [attestation.attestationId],
			// })

			console.log("signRequest validate", res, attestation)
			await fetchData()
			alert(
				"Transaction validated! Please wait a few moments for the blockchain to update and refresh the page."
			)
		} catch (error) {
			console.log("error signing request", error)
			setError(error)
		}
		setSignLoading(false)
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
	const showDraft = Boolean(data?.isActive)
	const showResult = Boolean(data && !data.winner)

	const getTitle = () => {
		if (showResult) {
			return (
				<span className="text-green-500">This request has been validated!</span>
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
				className="max-w-[1000px] p-4"
			>
				{invalid && (
					<div>
						<p>
							This contract may not exist or may be on another network, double
							check your currently connected network
						</p>
					</div>
				)}
				{showResult && (
					<div>
						{/* <div className="text-black-500"> */}
						<div>
							This request was validated by{" "}
							<Link
								className="text-blue-500 hover:underline"
								rel="noopener noreferrer"
								target="_blank"
								href={getExplorerUrl(data?.recipientAddress, currentChain)}
							>
								{abbreviate(data?.recipientAddress)}
							</Link>{" "}
							at {formatDate(data?.validatedAt)}
						</div>

						{data && (
							<div className="mt-4">
								<RenderObject title="Data" obj={data} keys={RESULT_KEYS} />
							</div>
						)}
						{/* attentation explorer link */}
						{data?.attestationId && (
							<div className="my-2">
								<Link
									className="text-blue-500 hover:underline"
									rel="noopener noreferrer"
									target="_blank"
									href={getAttestationUrl(data.attestationId)}
								>
									View attestation
								</Link>
							</div>
						)}
					</div>
				)}

				{showDraft && (
					<div>
						<div className="text-sm text-bold">
							<Link
								className="text-blue-500 hover:underline"
								rel="noopener noreferrer"
								target="_blank"
								href={getExplorerUrl(
									requireContractAddress(
										currentChain?.chainId || CHILIZ_TESTNET.chainId
									),
									currentChain
								)}
							>
								View on {currentChain?.displayName || "explorer"}
							</Link>
						</div>

						<PlayerDraft contestId={contestId} />
					</div>
				)}

				{result && (
					<div className="mt-4">
						<h3 className="text-lg font-bold">Result</h3>
						<p>{result}</p>
					</div>
				)}

				{error && <div className="text-red-500">{error.message}</div>}
			</BasicCard>
		</div>
	)
}
