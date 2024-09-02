export interface RequestData {
	entryFee?: number
	name?: string
	closeDateMillis?: number
	passcode?: string
}

export interface SchemaItem {
	name: string
	type: string
}

// string memory name,
// uint entryFee,
// uint prizePool,
// bool isActive,
// address winner,
// uint creationTime,
// uint closeTime,
// address owner
export interface ContestMetadata {
	name: string
	entryFee: number
	prizePool: number
	isActive: boolean
	winner: string
	creationTime: number
	closeTime: number
	owner: string
}

export interface SchemaEntry {
	name: string
	lineup: string
	timestamp: string
	signature: string
}

/*
status: "ACT",
		display_name: "A.J. Brown",
		first_name: "Arthur",
		last_name: "Brown",
		esb_id: "BRO413223",
		gsis_id: "00-0035676",
		birth_date: "1997-06-30",
		college_name: "Mississippi",
		position_group: "WR",
		position: "WR",
		jersey_number: 11,
		height: 72,
		weight: 226,
		years_of_experience: 6,
		team_abbr: "PHI",
		team_seq: 1,
		current_team_id: 3700,
		football_name: "A.J.",
		entry_year: 2019,
		rookie_year: 2019,
		draft_club: "TEN",
		draft_number: 51,
		college_conference: "Southeastern Conference",
		status_description_abbr: "A01",
		status_short_description: "Active",
		gsis_it_id: 47834,
		short_name: "A.Brown",
		smart_id: "32004252-4f41-3223-e4c5-1e30dffa87f8",
		headshot:
			"https://static.www.nfl.com/image/private/f_auto,q_auto/league/a014sgzctarbvhwb35lw",
		suffix: "",
		uniform_number: 11,
		draft_round: "",
        */

export interface Player {
	status: string
	display_name: string
	first_name: string
	last_name: string
	esb_id: string
	gsis_id: string
	birth_date: string
	college_name: string
	position_group: string
	position: string
	jersey_number: string
	height: string
	weight: string
	years_of_experience: string
	team_abbr: string
	team_seq: string
	current_team_id: string
	football_name: string
	entry_year: string
	rookie_year: string
	draft_club: string
	draft_string: string
	college_conference: string
	status_description_abbr: string
	status_short_description: string
	gsis_it_id: string
	short_name: string
	smart_id: string
	headshot: string
	suffix: string
	uniform_string: string
	draft_round: string
}

//  {
// 	chainNamespace: CHAIN_NAMESPACES.EIP155,
// 	chainId: "0x7a31c7",
// 	rpcTarget: "https://api.helium.fhenix.zone",
// 	displayName: "Fhenix Helium",
// 	blockExplorerUrl: "https://explorer.helium.fhenix.zone",
// 	ticker: "tFHE",
// 	tickerName: "tFHE",
// 	logo: "https://img.cryptorank.io/coins/fhenix1695737384486.png",
// }

export interface ChainConfig {
	chainNamespace: string
	chainId: string
	rpcTarget: string
	displayName: string
	blockExplorerUrl: string
	ticker: string
	tickerName: string
	logo: string
}
