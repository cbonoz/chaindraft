"use client"

import BasicCard from "@/components/basic-card"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { getMessagesMap } from "@/lib/playerchat/xmtp"
import { DecodedMessage } from "@xmtp/xmtp-js"
import { useEffect, useState } from "react"

const MessagePage = () => {
	const [messages, setMessages] = useState<DecodedMessage<any>[]>([])
	const [loading, setLoading] = useState(true)
	const { signer, address } = useWeb3AuthContext()

	async function loadMessages() {
		try {
			const messages = await getMessagesMap(address)
			const flattenedMessages = Object.values(messages).flat()
			setMessages(flattenedMessages)
		} catch (error) {
			console.error("Error loading messages", error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (address) {
			loadMessages()
		}
	}, [address])

	if (!address) {
		return (
			<div>
				<h1>Messages</h1>
				<p>You must connect your wallet to view messages.</p>
			</div>
		)
	}

	return (
		<BasicCard title="Messages" description="View your messages here.">
			{messages.map((message, index) => (
				<div key={index}>
					<p>{JSON.stringify(message)}</p>
				</div>
			))}
		</BasicCard>
	)
}

export default MessagePage
