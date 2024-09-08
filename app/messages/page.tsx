import dynamic from "next/dynamic"

const ConversationList = dynamic(
	() => import("@/components/conversation-list"),
	{
		ssr: false,
	}
)

const MessagesPage = () => {
	return (
		<div>
			<ConversationList />
		</div>
	)
}

export default MessagesPage
