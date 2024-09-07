import React, { useEffect, useState } from "react"
import Image from "next/image"
import { ContestMetadata, Player } from "@/lib/types"
import { GROUPED_PLAYERS } from "@/lib/data/players"
import { Button } from "@/components/ui/button"
import { shuffleArray } from "@/lib/utils"
import { siteConfig } from "@/util/site-config"
import CompletedDraft from "./completed-draft"
import PlayerCard from "./player-card"
import classNames from "classnames"
import { DEFAULT_PLAYER_IMAGE, EMPTY_DRAFT, POSITIONS } from "@/lib/constants"
import { Progress } from "./ui/progress"

interface Props {
	contestId: string
	contestData: ContestMetadata
}

const PlayerDraft = ({ contestId, contestData }: Props) => {
	const [draftedPlayers, setDraftedPlayers] =
		useState<Record<string, Player | null>>(EMPTY_DRAFT)
	const [skipsLeft, setSkipsLeft] = useState(siteConfig.maxDraftSkips)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [currentPosition, setCurrentPosition] = useState(POSITIONS[0])
	const [playerIndex, setPlayerIndex] = useState(0)

	useEffect(() => {
		setCurrentPosition(POSITIONS[currentIndex % POSITIONS.length])
	}, [currentIndex])

	// Generate the list of available players based on the current position
	const getAvailablePlayers = () => {
		const allPlayers = Object.values(GROUPED_PLAYERS).flat()
		return shuffleArray(allPlayers).filter(
			(player) =>
				player.position === currentPosition ||
				(currentPosition === "FLEX" &&
					["WR", "RB", "TE"].includes(player.position))
		)
	}

	const availablePlayers = getAvailablePlayers()
	const currentPlayer = availablePlayers[playerIndex] || {}

	const handleDraft = (player: Player) => {
		setDraftedPlayers({ ...draftedPlayers, [currentPosition]: player })
		setCurrentIndex(currentIndex + 1)
	}

	const handleSkip = () => {
		if (skipsLeft > 0) {
			setSkipsLeft(skipsLeft - 1)
			setPlayerIndex((playerIndex + 1) % availablePlayers.length)
		}
	}

	const reset = () => {
		setDraftedPlayers(EMPTY_DRAFT)
		setSkipsLeft(siteConfig.maxDraftSkips)
		setCurrentIndex(0)
		setPlayerIndex(0)
	}

	const isTerminalState =
		Object.values(draftedPlayers).filter((player) => player !== null).length ===
		siteConfig.numberDraftPlayers

	if (isTerminalState) {
		return (
			<CompletedDraft
				contestData={{} as any}
				draftedPlayers={draftedPlayers}
				reset={reset}
				contestId={contestId}
			/>
		)
	}

	return (
		<div className="w-full max-w-[1200px]">
			<Progress
				value={(currentIndex / siteConfig.numberDraftPlayers) * 100}
				className="mb-8"
			/>

			<div className="grid grid-cols-12 gap-8 w-full ">
				{/* Left Column: Drafted Players */}
				<div className="border-r col-span-3 justify-center align-center">
					<div className="text-xl font-bold mb-4">Drafted</div>
					{Object.values(draftedPlayers).map(
						(player) =>
							player && (
								<div
									key={player.smart_id}
									className="w-36 p-2 border rounded-lg bg-blue-50 shadow-md flex flex-col items-center text-center"
								>
									<div className="relative w-16 h-16 mb-2">
										<Image
											src={player.headshot || DEFAULT_PLAYER_IMAGE}
											alt={player.display_name}
											layout="fill"
											objectFit="cover"
											className="rounded-full border-4 border-blue-500"
										/>
									</div>
									<div className="font-bold text-md text-blue-800 mb-1">
										{player.display_name}
									</div>
									<div className="text-sm text-blue-600">{player.position}</div>
								</div>
							)
					)}

					{isTerminalState && (
						<div className="text-green-500 font-semibold mt-4">
							All {siteConfig.numberDraftPlayers} players have been drafted!
						</div>
					)}
				</div>

				{/* Right Column: Player Drafting */}
				<div className="grid col-span-9">
					<div className="mb-4">
						{/* TODO: replace with bars that diminish as skips are used */}
						Skips Left:&nbsp;
						<span
							className={classNames("font-semibold", {
								"text-red-500": skipsLeft <= 3,
							})}
						>
							{skipsLeft}
						</span>
					</div>

					<h2 className="text-xl font-semibold mb-4">
						Drafting for Position: {currentPosition}
					</h2>

					{currentPlayer && (
						<div className="flex flex-col items-center bg-gray-100 p-4 rounded shadow">
							<PlayerCard player={currentPlayer} />

							<div className="mt-2">
								<Button
									size={"lg"}
									className="mr-2"
									onClick={() => handleDraft(currentPlayer)}
									disabled={isTerminalState}
								>
									Draft
								</Button>
								<Button
									size={"lg"}
									variant="destructive"
									onClick={handleSkip}
									disabled={skipsLeft === 0 || isTerminalState}
								>
									Skip
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default PlayerDraft
