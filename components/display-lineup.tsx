"use client"

import { getPlayersFromIds } from "@/lib/data/players"
import { createConversation, sendMessage } from "@/lib/playerchat/xmtp"
import {
	abbreviate,
	getAttestationUrl,
	getExplorerUrl,
	getReadableError,
	isEmpty,
} from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"
import { ContestMetadata, Lineup } from "@/lib/types"
import PlayerCard from "./player-card"
import { Input } from "./ui/input"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import Link from "next/link"
import { setWinner } from "@/lib/contract/commands"

interface Props {
	lineup: Lineup
	contestData: ContestMetadata
	showDeclareWinner: boolean
	contestId: string
}

const DisplayLineup = ({
	contestId,
	lineup,
	contestData,
	showDeclareWinner,
}: Props) => {
	const { playerIds, owner: ownerAddress } = lineup
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")
	const [error, setError] = useState<any>(null)
	const [result, setResult] = useState<any>(null)
	const players = getPlayersFromIds(playerIds)

	const { signer, address, activeChain } = useWeb3AuthContext()
	const chainId = activeChain?.chainId

	const isSelf = ownerAddress === address

	const declareWinner = async () => {
		setError("")
		if (!signer || !chainId) {
			setError("Please connect your wallet")
			return
		}

		setLoading(true)
		try {
			console.log("Declaring winner", lineup)
			// declare winner
			const res = await setWinner(
				signer,
				activeChain?.chainId,
				contestId,
				ownerAddress
			)
			// console.log("declareWinner", res)
			window?.location?.reload()
		} catch (error) {
			console.log("Error declaring winner", error)
			setError(getReadableError(error))
		} finally {
			// clear
			setLoading(false)
		}
	}

	const sendMessageToOwner = async () => {
		setError("")
		if (isEmpty(message)) {
			setError("Please enter a message")
			return
		}

		// send message to owner
		try {
			console.log("Sending message to owner", message, ownerAddress)
			const conversation = await createConversation(signer, ownerAddress)
			console.log("createConversation", conversation)
			const formattedMessage = `${contestData.name}: ${message}`
			const res = await sendMessage(conversation, formattedMessage)
			console.log("sendMessage", res)
			alert("Message sent")
			setResult(res)
			setMessage("")
		} catch (error) {
			console.log("Error sending message to owner", error)
			setError(getReadableError(error))
		} finally {
			// clear
			setLoading(false)
		}
	}

	return (
		<div>
			<div className="my-2">
				{isSelf && <p>You are the owner of this lineup</p>}
				{!isSelf && (
					<p>
						This lineup was submitted by{" "}
						<span className="font-bold">
							<Link href={getExplorerUrl(ownerAddress, activeChain)}>
								{abbreviate(ownerAddress)}
							</Link>
						</span>
					</p>
				)}

				{/* show attestation */}
				{lineup.attestationId && (
					<span>
						<Link
							className="text-blue-500 hover:underline"
							rel="noopener noreferrer"
							target="_blank"
							href={getAttestationUrl(lineup.attestationId)}
						>
							Attached attestation
						</Link>
					</span>
				)}

				{/* show declare winner button */}
				{showDeclareWinner && (
					<Button
						variant={"link"}
						onClick={declareWinner}
						disabled={loading}
						// className="font-bold underline"
					>
						Declare this lineup the winner
						{loading && <ReloadIcon className="animate-spin ml-1" />}
					</Button>
				)}

				<div className="flex flex-row gap-2">
					{players.map((player, index) => {
						return <PlayerCard reduced key={index} player={player} width={24} />
					})}
				</div>
				{/* send message to owner */}
				{!isSelf && (
					<div>
						<label htmlFor="message">
							Send {abbreviate(ownerAddress)} a message:
						</label>
						<Input
							type="text"
							name="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<Button
							className="mt-2"
							disabled={loading || isEmpty(message)}
							onClick={sendMessageToOwner}
						>
							Send message
							{loading && <ReloadIcon className="animate-spin ml-1" />}
						</Button>
					</div>
				)}
				{/* show error */}
				{error && <div className="text-red-500 mt-4">{error}</div>}
			</div>
		</div>
	)
}

export default DisplayLineup
