"use client"

import { config } from "@/app/config"
import BasicCard from "@/components/basic-card"
import RenderObject from "@/components/render-object"
import { Button } from "@/components/ui/button"
import { APP_CONTRACT } from "@/lib/contract/metadata"
import { useEthersSigner } from "@/lib/get-signer"
import { ContractMetadata, SchemaEntry } from "@/lib/types"
import {
	abbreviate,
	formatCurrency,
	formatDate,
	getAttestationUrl,
	getExplorerUrl,
	getIpfsUrl,
	transformMetadata,
} from "@/lib/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Address, Chain, createPublicClient, http } from "viem"
import { writeContract } from "@wagmi/core"
import crypto from "crypto"

import {
	useAccount,
	useChainId,
	useChains,
	useSwitchChain,
	useWriteContract,
} from "wagmi"
import { createAttestation, getAttestation } from "@/lib/ethsign"
import PlayerDraft from "@/components/player-draft"

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
	contestId: Address
}

export default function FundRequest({ params }: { params: Params }) {
	const [loading, setLoading] = useState(true)
	const [signLoading, setSignLoading] = useState(false)
	const [data, setData] = useState<ContractMetadata | undefined>()
	const [result, setResult] = useState<any>(null)
	const [error, setError] = useState<any>(null)
	const ref = useRef(null)
	const { chains, switchChain } = useSwitchChain()
	const { address } = useAccount()

	const router = useRouter()

	const { contestId } = params

	const chainId = useChainId()
	const currentChain: Chain | undefined = (chains || []).find(
		(c) => c.id === chainId
	)

	const signer = useEthersSigner({ chainId })

	async function fetchData() {
		setLoading(true)
		try {
			const publicClient = createPublicClient({
				chain: currentChain,
				transport: http(),
			})
			let contractData: ContractMetadata = transformMetadata(
				(await publicClient.readContract({
					abi: APP_CONTRACT.abi,
					address: contestId,
					functionName: "getMetadata",
				})) as ContractMetadata
			)
			// convert balance and validatedAt to number from bigint
			console.log("contractData", contractData)
			setData(contractData)

			if (contractData.attestationId) {
				const res = await getAttestation(contractData.attestationId)
				console.log("getAttestation", res)
			}
		} catch (error) {
			console.log("error reading contract", error)
			setError(error)
		} finally {
			setLoading(false)
		}
	}

	// https://wagmi.sh/react/guides/read-from-contract
	// const { data: balance } = useReadContract({
	//     ...wagmiContractConfig,
	//     functionName: 'balanceOf',
	//     args: ['0x03A71968491d55603FFe1b11A9e23eF013f75bCF'],
	//   })

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
		const d: ContractMetadata = data
		// generate hash of privateKey
		signature = crypto
			.createHash("sha256")
			.update(d.recipientAddress)
			.digest("hex")
			.toString()

		try {
			const schemaEntry: SchemaEntry = {
				name: d.recipientName,
				request: d.name,
				timestamp: Date.now().toString(),
				signature,
				// signatureData,
			}

			const attestation = await createAttestation(signer, schemaEntry)
			// const attestation = { attestationId: '1234' }
			// await switchChain({ chainId })

			console.log("created attestation", attestation)
			const res = await writeContract(config, {
				abi: APP_CONTRACT.abi,
				address: contestId,
				functionName: "validate",
				args: [attestation.attestationId],
			})

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

	const authorized = data && address === data.recipientAddress
	const invalid = !loading && !data
	const isValidated = Boolean(data?.validatedAt)
	const showContest = Boolean(authorized && !isValidated)
	const showResult = Boolean(authorized && isValidated)

	const getTitle = () => {
		if (showResult) {
			return (
				<span className="text-green-500">This request has been validated!</span>
			)
		}
		if (showContest) {
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

				{!authorized && (
					<div>
						<p>Not authorized to sign this request</p>
					</div>
				)}

				{showResult && (
					<div>
						<div className="text-sm text-bold">
							<Link
								className="text-blue-500 hover:underline"
								rel="noopener noreferrer"
								target="_blank"
								href={getExplorerUrl(contestId, currentChain) || ""}
							>
								View on {data?.network || "explorer"}
							</Link>
						</div>

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

				{showContest && (
					<div>
						<div className="text-sm text-bold">
							<Link
								className="text-blue-500 hover:underline"
								rel="noopener noreferrer"
								target="_blank"
								href={getExplorerUrl(contestId, currentChain) || ""}
							>
								View on {data?.network || "explorer"}
							</Link>
						</div>

						{data && <PlayerDraft contestId={contestId} />}

						<div className="my-4 border w-[325px] p-1">
							<div className="text-med font-bold">Sign here</div>
							<SignatureCanvas ref={ref} />
						</div>

						<Button
							onClick={() => {
								signRequest()
							}}
						>
							{signLoading && (
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							)}
							Submit draft
						</Button>
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
