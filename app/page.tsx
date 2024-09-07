"use client"

import { RouteButtons } from "@/components/route-buttons"
import { ACTIVE_PLAYERS_WITH_HEADSHOTS } from "@/lib/data/players"
import { siteConfig } from "@/util/site-config"
import { useState } from "react"

export default function Home() {
	const onSwipe = (direction: string) => {
		if (direction === "right") {
			console.log("swiped right")
		} else {
			console.log("swiped left")
		}
		setPlayerIndex(playerIndex + 1)
	}

	const [playerIndex, setPlayerIndex] = useState(0)
	const activePlayer = ACTIVE_PLAYERS_WITH_HEADSHOTS[playerIndex]
	return (
		<main className="flex min-h-screen flex-col p-24">
			{/* <h1 className="text-4xl font-bold">Welcome to chaindraft</h1> */}
			<div>
				<img src="/logo.png" alt="chaindraft" className="my-4" />
				<p className="text-lg pt-8">{siteConfig.description}.</p>
			</div>
			<div className="mt-8">
				<RouteButtons />
			</div>
		</main>
	)
}
