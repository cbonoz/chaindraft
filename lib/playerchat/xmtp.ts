import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js"
// Create the client with a `Signer` from your application

type Env = "dev" | "production" | "local"
const xmtpEnv = process.env.NEXT_PUBLIC_XMTP_ENV || "dev"
const xmtpEnvOption = { env: xmtpEnv as Env }

export const createConversation = async (
	signer: any,
	address: any
): Promise<Conversation<any>> => {
	const xmtp = await Client.create(signer, xmtpEnvOption)

	const isOnNetwork = await xmtp.canMessage(address)
	if (!isOnNetwork) {
		throw new Error("User is not on the network")
	}

	return await xmtp.conversations.newConversation(address)
}

export const sendMessage = async (
	conversation: Conversation<any>,
	message: string
) => {
	// const xmtp = await Client.create(signer, xmtpEnvOption)
	// standard (string) message
	const preparedTextMessage = await conversation.prepareMessage(message)
	return await preparedTextMessage.send()
}

export const getMessagesMap = async (
	signer: any
): Promise<Record<string, DecodedMessage<any>[]>> => {
	const xmtp = await Client.create(signer, xmtpEnvOption)
	const peerToMessage: Record<string, DecodedMessage<any>[]> = {}
	for (const conversation of await xmtp.conversations.list()) {
		// All parameters are optional and can be omitted
		const opts = {
			// Show message from the last 7 days
			startTime: new Date(new Date().setDate(new Date().getDate() - 7)),
			endTime: new Date(),
		}
		const messagesInConversation = await conversation.messages(opts)
		peerToMessage[conversation.peerAddress] = messagesInConversation
	}
	return peerToMessage
}
