"use client"

import BasicCard from "@/components/basic-card"
import ChatTabs from "@/components/chat-tabs"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { getMessagesMap } from "@/lib/playerchat/xmtp"
import { getReadableError } from "@/lib/utils"
import { ReloadIcon } from "@radix-ui/react-icons"
import { DecodedMessage } from "@xmtp/xmtp-js"
import { set } from "date-fns"
import { useEffect, useState } from "react"

const MessagePage = () => {
	const [messageMap, setMessageMap] = useState<
		Record<string, DecodedMessage[]>
	>({})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<any>(null)
	const { signer, address } = useWeb3AuthContext()

	async function loadMessages() {
		setError(null)
		setLoading(true)
		try {
			const messages = await getMessagesMap(signer)
			console.log("messages", messages)
			setMessageMap(messages)
		} catch (error) {
			console.error("Error loading messages", error)
			setError(getReadableError(error))
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
		<BasicCard
			className="bg-white dark:bg-gray-800 max-w-[1200px] mx-auto mt-8"
			title="Messages"
			description="View your conversations with other players here."
		>
			{Object.keys(messageMap).length > 0 && <ChatTabs messageMap={messageMap} setMessageMap={setMessageMap} />}
			{loading && <ReloadIcon className="animate-spin" />}
			{error && <p className="text-red-500">{error}</p>}
		</BasicCard>
	)
}

export default MessagePage
