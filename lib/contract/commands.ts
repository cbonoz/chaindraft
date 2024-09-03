import { APP_CONTRACT } from "./metadata"
import {
	contestArrayToObject,
	dateToMillis,
	formatDate,
	requireValue,
} from "../utils"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS_MAP } from "../chains"
import { ContestMetadata, RequestData } from "../types"
import { sub } from "date-fns"

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
	// log
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
	const submissionCloseDate = dateToMillis(data.closeDateMillis)
	const result = await contract.createContest(
		data.name,
		data.entryFee,
		data.passcode || "",
		submissionCloseDate
	)
	console.log("result", result)
	return result
}

export const submitEntry = async (
	signer: any,
	chainId: string,
	contestId: number,
	lineup: any,
	passcode: any
) => {
	const address = requireContractAddress(chainId)
	const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
	const result = await contract.submitLineup(contestId, lineup, passcode || "")
	console.log("result", result)
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
	console.log("result", result)
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
	console.log("result", contestId, result)
	return contestArrayToObject(contestId, result)
}
