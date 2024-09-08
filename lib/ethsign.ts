import {
	SignProtocolClient,
	SpMode,
	OffChainSignType,
	IndexService,
	OffChainRpc,
} from "@ethsign/sp-sdk"
import { privateKeyToAccount } from "viem/accounts"
import crypto from "crypto"
import { SchemaEntry } from "./types"
import { siteConfig } from "@/util/site-config"

// https://docs.sign.global/developer-apis/index-1/npm-sdk#off-chain-arweave-mode
// const privateKey = '0xabc' // optional

var id = crypto.randomBytes(32).toString("hex")
const privateKey: any = `0x${id}`

const SCHEMA_ID: string = process.env.NEXT_PUBLIC_SCHEMA_ID + ""

const schemaItem = (name: string): { name: any; type: any } => ({
	name,
	type: "string",
})

const getClient = (signer?: any) => {
	const client = new SignProtocolClient(SpMode.OffChain, {
		signType: OffChainSignType.EvmEip712,
		rpcUrl: OffChainRpc.mainnet,
		account: privateKeyToAccount(privateKey),
	})
	return client
}

export const getAttestation = async (attestationId: string) => {
	const client = getClient()
	const attestationInfo = await client.getAttestation(attestationId)
	return attestationInfo
}

export const createSchema = async (signer?: any) => {
	//create schema
	const client = getClient(signer)
	const data = [
		schemaItem("name"),
		schemaItem("timestamp"),
		schemaItem("data"),
		schemaItem("signature"),
	]
	const title = siteConfig.title
	const schemaInfo = await client.createSchema({
		name: title,
		data,
	})
	return { schemaId: schemaInfo.schemaId, data: JSON.stringify(data), title }
}
// https://docs.sign.global/developer-apis/index/api
export const createAttestation = async (signer: any, data: SchemaEntry) => {
	const client = getClient(signer)
	//create attestation
	const indexingValue = `${data.data}_${data.timestamp}`
	console.log("create sign request", SCHEMA_ID, indexingValue, data, signer)
	const attestationInfo = await client.createAttestation({
		schemaId: SCHEMA_ID,
		data,
		indexingValue,
	})
	// log
	console.log("attestationInfo", attestationInfo)
	return attestationInfo
}

export const getAttestations = async (page: number, indexingValue?: string) => {
	const indexService = new IndexService("testnet")
	return await indexService.queryAttestationList({
		schemaId: SCHEMA_ID,
		indexingValue,
		page: page,
	})
}
