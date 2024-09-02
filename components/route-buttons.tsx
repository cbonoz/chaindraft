"use client"

import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

export const RouteButtons = () => {
	const router = useRouter()
	return (
		<div className="flex space-x-4">
			<Button
				className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
				onClick={() => router.push("/create")}
			>
				Draft
			</Button>

			<Button
				className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
				onClick={() => router.push("/contest")}
			>
				Challenge
			</Button>
		</div>
	)
}
