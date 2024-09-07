import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Chain } from "viem"
import { CustomChainConfig } from "@web3auth/base"
import { BigNumberish, ContractTransactionReceipt, ethers } from "ethers"
import { ContestMetadata } from "./types"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const isEmpty = (obj: any) => !obj || obj.length === 0

export const getAttestationUrl = (attestationId: string) => {
	return `https://scan.sign.global/attestation/${attestationId}`
}

export const abbreviate = (s: string | undefined | null, chars?: number) =>
	s ? `${s.substr(0, chars || 6)}**` : ""

export const assertTrue = (condition: boolean, message: string) => {
	if (!condition) {
		throw new Error(message)
	}
}

// Helper function to shuffle an array
export const shuffleArray = (array: any[]) => {
	return array.sort(() => Math.random() - 0.5)
}

export const formatCurrency = (amount: number, chain?: Chain) => {
	if (!chain) {
		return `${amount} ETH`
	}
	// decimals
	const decimals = chain.nativeCurrency.decimals
	const symbol = chain.nativeCurrency.symbol
	return `${amount / 10 ** decimals} ${symbol}`
}

export const getExplorerUrl = (
	address?: string,
	chain?: CustomChainConfig,
	isTx?: boolean
) => {
	const prefix = isTx ? "tx" : "address"
	const baseUrl = chain?.blockExplorerUrl
	if (!baseUrl || !address) {
		return ""
	}
	return `${baseUrl}/${prefix}/${address}`
}

export const ethToWei = (amount: any) => {
	return ethers.parseEther(amount + "")
}

export const getPlaceholderDescription = () => {
	// week from now
	const date = new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000
	).toLocaleDateString()
	return `This is to validate proof of funds to have your offer considered. See the attachment below, sign at your earliest convenience but this would be nice to have by ${date}.`
}

export const getContestUrl = (contestId: string) => {
	return `/contest/${contestId}`
}

// convert maybe date to millis
export const dateToMillis = (d: Date | string | number | undefined): number => {
	if (!(d instanceof Date)) {
		d = d ? new Date(d) : new Date()
	}
	return d.getTime()
}

export const isContestUrl = (url: string) => {
	return url.includes("/contest/")
}

export const isZeroAddress = (address: string | undefined) => {
	if (!address || isEmpty(address)) {
		return true
	}
	// check if address is only zeroes
	return /^0x0*$/.test(address)
}

export const getContestIdFromLogs = (receipt: ContractTransactionReceipt) => {
	const logs = receipt?.logs || []
	const log = logs.find((log: any) => log.eventName === "ContestCreated")
	const contestIdBigNumber: BigNumberish = (log as any)?.args?.[0]
	return contestIdBigNumber.toString()
}

export const requireValue = (value: any, errMessage: string) => {
	if (!value) {
		throw new Error(errMessage)
	}
	return value
}

export const formatDate = (
	d: Date | string | number | undefined,
	onlyDate?: boolean
) => {
	if (!(d instanceof Date)) {
		d = d ? new Date(d) : new Date()
	}

	if (onlyDate) {
		return d.toLocaleDateString()
	}
	return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export const isValidEmail = (email: string) => {
	return email && email.indexOf("@") !== -1
}

export const getNameFromUser = (user: any) => {
	return `${user.firstName} ${user.lastName}`
}

export const getReadableError = (err: any) => {
	return abbreviate(getReadableErrorInternal(err), 100)
}

export const getReadableErrorInternal = (err: any) => {
	if (err?.info?.error?.data?.message) {
		return err.info.error.data.message
	} else if (err?.info?.error?.message) {
		return err.info.error.message
	} else if (err.message) {
		return err.message
	} else if (err instanceof Error) {
		return JSON.stringify(err)
	}
	const errorMessage =
		(err?.info?.message ||
			err?.info ||
			err?.message ||
			err ||
			"Unknown Error") + ""
	if (errorMessage.indexOf("network changed")) {
		return "Network changed. Please ensure you are connected to the Theta network."
	} else if (errorMessage.indexOf("User denied transaction signature")) {
		return "User denied transaction signature"
	} else if (errorMessage.indexOf("not on the network")) {
		return "User is not on the network. Ask the user to join on XMTP!"
	}
	return errorMessage
}

export const signUrl = (address: string) =>
	`${window.location.origin}/sign/${address}`

export const termsUrl = () => `${window.location.origin}/terms`

export const convertCamelToHuman = (str: string) => {
	// Check if likely datetime timestamp ms
	if (str.length === 13) {
		// Check if parseable as a date
		const date = new Date(parseInt(str))
		if (!isNaN(date.getTime())) {
			return formatDate(date)
		}
	}

	return str
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, function (s) {
			return s.toUpperCase()
		})
		.replace(/_/g, " ")
}

export function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

export const getIpfsUrl = (cid: string) => {
	return `https://gateway.lighthouse.storage/ipfs/${cid}`
}

export const isParticipant = (
	contest: ContestMetadata | undefined | null,
	address: string
) => {
	return contest?.lineups?.some((lineup) => lineup.owner === address)
}

export const contestArrayToObject = (
	contestId: any,
	arr: any[]
): ContestMetadata => {
	const [
		name,
		entryFee,
		prizePool,
		cancelled,
		winner,
		creationTime,
		closeTime,
		allowedTeams,
		owner,
		lineups,
		passcodeHash,
	] = arr

	// convert linups to array
	const lineupsArr = Object.values(lineups).map((lineup: any) => {
		const [playerIds, isSubmitted, submissionTime, owner, attestationId] =
			lineup
		return {
			playerIds: Object.values(playerIds),
			isSubmitted,
			submissionTime,
			owner,
			attestationId,
		}
	})

	return {
		id: contestId,
		name,
		entryFee,
		prizePool,
		cancelled,
		winner,
		creationTime,
		closeTime,
		allowedTeams,
		owner,
		lineups: lineupsArr as any,
		passcodeHash,
	}
}
