import { Player } from "@/lib/types"
import React from "react"
import PlayerCard from "./player-card"
import Image from "next/image"
import { POSITIONS } from "@/lib/constants"

interface Props {
	draftedPlayers: Record<string, Player | null>
	reset: () => void
}

const CompletedDraft = ({ draftedPlayers, reset }: Props) => {
	const players = Object.values(draftedPlayers).filter(
		(player) => player !== null
	)

	return (
		<div className="justify-center max-w-[1200px]">
			{/* <Image
				src="/logo.png"
				alt="chaindraft"
				className="my-4"
				width={200}
				height={100}
			/> */}
			<div className="text-green-500 text-2xl font-bold">Nice draft!</div>
			<div className="flex flex-row gap-4 max-w-[1200px]">
				{players.map((player, index) => (
					<div className="gap-4">
						<PlayerCard
							key={index}
							player={player}
							position={POSITIONS[index]}
						/>
					</div>
				))}
			</div>
			<div>
				<button
					onClick={reset}
					className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
				>
					Reset Draft
				</button>
			</div>
		</div>
	)
}
export default CompletedDraft
