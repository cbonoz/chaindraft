"use client"

import BasicCard from "@/components/basic-card"
import RenderObject from "@/components/render-object"
import { Button } from "@/components/ui/button"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { CHILIZ_TESTNET, CONTRACT_ADDRESS_MAP } from "@/lib/chains"
import { deployContract } from "@/lib/contract/commands"
import { createSchema } from "@/lib/ethsign"
import { getExplorerUrl, getReadableError, isEmpty } from "@/lib/utils"
import { siteConfig } from "@/util/site-config"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import { Chain } from "viem"

const AdminPage = () => {
	const [contract, setContract] = useState<any>()
	const [error, setError] = useState<any>(null)
	const [result, setResult] = useState<any>({
		schemaId: process.env.NEXT_PUBLIC_SCHEMA_ID,
	})
	const [schemaLoading, setSchemaLoading] = useState(false)
	const [loading, setLoading] = useState(false)

	const { signer, provider, activeChain: currentChain } = useWeb3AuthContext()

	const getSchemaId = async () => {
		setSchemaLoading(true)
		try {
			const res = await createSchema()
			console.log("createSchema", res)
			setResult(res)
		} catch (error) {
			console.log("error creating schema", error)
		} finally {
			setSchemaLoading(false)
		}
	}

	async function deployMasterContract() {
		setLoading(true)
		setError(null)

		try {
			// Deploy master contract
			const res = await deployContract(signer)
			console.log("Master contract deployed:", res)
			setContract(res)
		} catch (err) {
			console.error("Error deploying master contract:", err)
			setError(getReadableError(err))
		} finally {
			setLoading(false)
		}
	}

	const masterAddress =
		CONTRACT_ADDRESS_MAP[currentChain?.chainId || CHILIZ_TESTNET.chainId]

	return (
		<div className="flex flex-col items-center justify-center mt-8">
			<h1 className="text-2xl font-bold my-4 text-center">Admin Controls</h1>
			<BasicCard title={`Deploy ${siteConfig.title} master contract`}>
				{masterAddress && (
					<span>
						Master contract address:{" "}
						<span className="font-bold">{masterAddress}</span> (
						{currentChain?.displayName})
					</span>
				)}
				{!masterAddress && (
					<p>Master contract address not set ({currentChain?.displayName})</p>
				)}

				<div className="text-md my-4">
					Deploy a new master contract instance to the{" "}
					{currentChain?.displayName || ""} blockchain.
				</div>

				<Button
					onClick={deployMasterContract}
					disabled={loading}
					variant={"secondary"}
				>
					Deploy master contract
					{loading && (
						<span className="animate-spin ml-1">
							<ReloadIcon />
						</span>
					)}
				</Button>

				{loading && (
					<div className="mt-4 italic">
						Do not leave this page until the transaction is confirmed.
					</div>
				)}

				{error && <div className="text-red-500">{error}</div>}

				{contract?.address && (
					<div className="mt-4">
						<div className=" text-green-500">
							Master contract deployed at: {contract?.address}
						</div>
						<a
							href={getExplorerUrl(contract?.address, currentChain)}
							target="_blank"
							rel="noreferrer"
							className="text-blue-500 mt-4 block text-sm hover:underline"
						>
							View contract on {currentChain?.displayName} explorer
						</a>
					</div>
				)}
			</BasicCard>

			<BasicCard
				className="mt-8"
				title="Generate Schema ID"
				description="Generate a schema ID for user attestations on contest submissions"
			>
				<Button
					onClick={getSchemaId}
					disabled={schemaLoading}
					className="mt-3"
					variant={"secondary"}
				>
					{schemaLoading && (
						<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
					)}
					Get Schema ID
				</Button>

				{result && (
					<div className="my-2">
						<RenderObject title="Schema Created" obj={result} />
					</div>
				)}
			</BasicCard>
		</div>
	)
}

export default AdminPage
