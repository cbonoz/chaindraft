"use client"

import { useState } from "react"
import BasicCard from "@/components/basic-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const Sign = () => {
	const [contestId, setContestId] = useState<string>("")
	const router = useRouter()

	return (
		<div className="flex flex-row items-center justify-center mt-8">
			<BasicCard
				title="Find contest"
				description="Find and participate in a fantasy contest using your wallet."
				className="min-w-[400px] p-4"
			>
				<Input
					placeholder="Enter contest id"
					value={contestId}
					onChange={(e) => setContestId(e.target.value)}
				/>

				<Button
					className="mt-4"
					onClick={() => {
						console.log("Go to contest")
						router.push(`/contest/${contestId}`)
					}}
				>
					Go to contest page
				</Button>
			</BasicCard>
		</div>
	)
}

export default Sign
