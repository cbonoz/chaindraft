import { RequestData } from "./types"

export const DEFAULT_PLAYER_IMAGE = "/default_player_image.png"
export const POSITIONS: string[] = ["QB", "RB", "WR", "TE", "FLEX"]

export const NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID as string

export const EMPTY_DRAFT: Record<string, null> = {
	QB: null,
	RB: null,
	WR: null,
	TE: null,
	FLEX: null,
}
