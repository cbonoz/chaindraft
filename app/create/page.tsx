"use client"
import CreateContest from "@/components/create-contest"
import PlayerDraft from "@/components/player-draft"

const CreatePage = () => {
	// Get cont:
	return (
		// container classes centered
		<div className="flex flex-row justify-center mt-8">
			<CreateContest />
		</div>
	)
}

export default CreatePage
