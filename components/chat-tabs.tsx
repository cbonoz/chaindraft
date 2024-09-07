import { sendMessage } from "@/lib/playerchat/xmtp"
import { DecodedMessage } from "@xmtp/xmtp-js"
import React, { useState } from "react"

interface Props {
	messageMap: Record<string, DecodedMessage<any>[]>
	setMessageMap: (messageMap: Record<string, DecodedMessage<any>[]>) => void
}

const ChatTabs = ({ messageMap, setMessageMap }: Props) => {
	// State to manage active tab (default to the first contact)
	const [activeTab, setActiveTab] = useState(Object.keys(messageMap)[0])

	// State to track input messages for each contact
	const [messageInputs, setMessageInputs] = useState<any>({})

	// Function to handle message input change
	const handleInputChange = (address: string, text: string) => {
		setMessageInputs((prev: any) => ({
			...prev,
			[address]: text,
		}))
	}

	// Function to send message
	const handleSendMessage = async (conversation: any, address: string) => {
		const messageText = messageInputs[address]
		if (messageText && messageText.trim()) {
			const message = await sendMessage(conversation, messageText) // Assuming sendMessage is globally available
			messageMap[address].push(message)
			setMessageMap({ ...messageMap })
			setMessageInputs((prev: any) => ({
				...prev,
				[address]: "", // Clear input after sending
			}))
		}
	}

	return (
		<div className="container mx-auto p-4">
			{/* Tab headers */}
			<div className="flex border-b mb-4">
				{Object.keys(messageMap).map((address) => (
					<button
						key={address}
						onClick={() => setActiveTab(address)}
						className={`px-4 py-2 text-gray-600 hover:text-blue-500 focus:outline-none ${
							activeTab === address
								? "border-b-2 border-blue-500 text-blue-500"
								: ""
						}`}
					>
						{address}
					</button>
				))}
			</div>

			{/* Tab content */}
			<div>
				{(messageMap[activeTab] || []).map((message: any, index) => (
					<div key={index} className="border p-4 rounded-lg mb-2">
						<div className="text-sm text-gray-500">
							{message.sent.toLocaleString()}
						</div>
						<div className="font-semibold">{message.senderAddress}</div>
						<div className="mt-2">{message.content}</div>
					</div>
				))}

				{/* Message input and send button */}
				<div className="mt-4">
					<textarea
						value={messageInputs[activeTab] || ""}
						onChange={(e) => handleInputChange(activeTab, e.target.value)}
						className="border rounded-lg w-full p-2"
						placeholder="Type your message..."
					/>
					<button
						onClick={() =>
							handleSendMessage(
								messageMap[activeTab][0].conversation,
								activeTab
							)
						}
						className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
					>
						Send
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatTabs
