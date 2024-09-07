import { APP_CONTRACT } from "./metadata"
import { contestArrayToObject, dateToMillis, requireValue } from "../utils"
import { ethers } from "ethers"
import { CHAIN_OPTIONS, CONTRACT_ADDRESS_MAP } from "../chains"
import { ContestMetadata, Player, RequestData } from "../types"
import { siteConfig } from "@/util/site-config"

export function requireContractAddress(chainId: string) {
	const network = CHAIN_OPTIONS.find((chain) => chain.chainId === chainId)
	const address = requireValue(
		CONTRACT_ADDRESS_MAP[chainId],
		"Master app contract address not found for active chainId: " +
			chainId +
			" - " +
			(network?.displayName || "Unknown network")
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
	// Wait for the transaction to be mined
	const receipt = await result.wait()

	console.log("Create contest receipt:", receipt) // Assuming it's a BigNumber
	return receipt
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

	// await
	await result.wait()
	return result
}

export const startContest = async (
	signer: any,
	chainId: string,
	contestId: string
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const result = await contract.startContest(contestId)
	console.log("startContest", result)
	await result.wait()
	return result
}

export const cancelContest = async (
	signer: any,
	chainId: string,
	contestId: string
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const result = await contract.cancelContest(contestId)
	console.log("cancelContest", result)
	await result.wait()
	return result
}

export const setWinner = async (
	signer: any,
	chainId: string,
	contestId: string,
	winner: string
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const result = await contract.setWinner(contestId, winner)
	await result.wait()
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
