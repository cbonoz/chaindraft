import { APP_CONTRACT } from "./metadata"
import { contestArrayToObject, dateToMillis, requireValue } from "../utils"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS_MAP } from "../chains"
import { ContestMetadata, Player, RequestData } from "../types"
import { siteConfig } from "@/util/site-config"

export function requireContractAddress(network: string) {
	const address = requireValue(
		CONTRACT_ADDRESS_MAP[network],
		"Master app contract address not found for network: " + network
	)
	return address
}

export async function deployContract(signer: any) {
	// Deploy contract with ethers
	const factory = new ethers.ContractFactory(
		APP_CONTRACT.abi,
		APP_CONTRACT.bytecode,
		signer
	)

	let contract: any = await factory.deploy()
	console.log("Deploying contract...")

	contract = await contract.waitForDeployment()
	console.log("deployed contract...", contract.target)
	return { address: contract.target }
}

export const createContest = async (
	signer: any,
	chainId: string,
	data: RequestData
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const submissionCloseDate: number = dateToMillis(data.closeDateMillis)

	let allowedTeams = ""

	if (data.allowedTeams) {
		allowedTeams = data.allowedTeams.join(",")
	}

	const result = await contract.createContest(
		data.name,
		data.entryFee,
		data.passcode || "",
		submissionCloseDate,
		allowedTeams
	)
	console.log("createContest", result)
	return result
}

export const submitLineup = async (
	signer: any,
	chainId: string,
	contestId: string,
	players: Player[],
	passcode: any,
	attestationId: string
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)

	// check for right number of players
	if (players.length !== siteConfig.numberDraftPlayers) {
		throw new Error(
			"Invalid number of players, expected " + siteConfig.numberDraftPlayers
		)
	}

	const playerIds = players.map((player) => player.smart_id)

	const result = await contract.submitLineup(
		contestId,
		playerIds,
		passcode || "",
		attestationId
	)
	console.log("submitLineup", result)
	return result
}

export const setWinner = async (
	signer: any,
	chainId: string,
	contestId: number,
	winner: string
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const result = await contract.setWinner(contestId, winner)
	console.log("setWinner", result)
	return result
}

export const getContestInfo = async (
	signer: any,
	chainId: string,
	contestId: number
): Promise<ContestMetadata> => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const result = await contract.getContestInfo(contestId)
	console.log("getContestInfo", contestId, result)
	return contestArrayToObject(contestId, result)
}
