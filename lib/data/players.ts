import { Player } from "../types"
import { OFFENSE_PLAYERS } from "./data"

export const getPlayersFromIds = (playerIds: string[]): Player[] => {
	return playerIds
		.map((id) => {
			return OFFENSE_PLAYERS.find((player) => player.smart_id === id)
		})
		.filter((player) => player !== undefined) as Player[]
}

// group players by position
export const GROUPED_PLAYERS: Map<
	String,
	Array<Player>
> = OFFENSE_PLAYERS.reduce((acc: any, player) => {
	if (!acc[player.position]) {
		acc[player.position] = []
	}
	acc[player.position].push(player)
	return acc
}, {})

export const ALL_TEAMS = new Set(
	OFFENSE_PLAYERS.map((player) => player.team_abbr)
)

export const TEAM_OPTIONS = Array.from(ALL_TEAMS).map((team) => ({
	value: team,
	label: team,
}))
