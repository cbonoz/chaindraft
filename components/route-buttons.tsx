"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export const RouteButtons = () => {
	const router = useRouter()
	return (
		<div className="space-x-4">
			<Button
				size={"lg"}
				className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
				onClick={() => router.push("/create")}
			>
				Create contest
			</Button>

			<Button
				size={"lg"}
				className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
				onClick={() => router.push("/contest")}
			>
				Enter a challenge
			</Button>
		</div>
	)
}
