"use client"

import { getPlayersFromIds } from "@/lib/data/players"
import { createConversation, sendMessage } from "@/lib/playerchat/xmtp"
import { abbreviate, getReadableError } from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"
import { Lineup } from "@/lib/types"
import PlayerCard from "./player-card"

interface Props {
	lineup: Lineup
}

const DisplayLineup = ({ lineup }: Props) => {
	const { playerIds, owner: ownerAddress } = lineup
	const [loading, setLoading] = useState(true)
	const [message, setMessage] = useState("")
	const [error, setError] = useState<any>(null)
	const [result, setResult] = useState<any>(null)
	const players = getPlayersFromIds(playerIds)

	const sendMessageToOwner = async () => {
		setError("")
		if (!message) {
			setError("Please enter a message")
			return
		}

		// send message to owner
		try {
			console.log("Sending message to owner", message, ownerAddress)
			const conversation = await createConversation(ownerAddress, message)
			console.log("createConversation", conversation)
			const res = await sendMessage(conversation, message)
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
			<h1>Lineup</h1>
			<div>
				{players.map((player, index) => {
					return <PlayerCard reduced key={index} player={player} width={24} />
				})}
			</div>
			<div>
				<p>Owner: {ownerAddress}</p>
				{/* send message to owner */}
				<div>
					<label htmlFor="message">Message owner</label>
					<input
						type="text"
						name="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button disabled={loading} onClick={sendMessageToOwner}>
						Send message
					</Button>
				</div>
			</div>
		</div>
	)
}

export default DisplayLineup
