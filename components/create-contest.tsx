import { Button } from "./ui/button"
import { Input } from "./ui/input"
import BasicCard from "./basic-card"

const CreateContest = () => {
	return (
		<div
			className="w-full max-w-4xl
    "
		>
			<div className="flex flex-row items-center justify-center mt-8">
				<BasicCard
					title="Create a contest"
					description="Create a new contest and invite your friends to join."
					className="min-w-[400px] p-4"
				>
					<Input placeholder="Enter contest name" />
					<Input placeholder="Enter contest prize" />
					<Input placeholder="Enter contest duration" />
					<Button>Create contest</Button>
				</BasicCard>
			</div>
		</div>
	)
}

export default CreateContest
