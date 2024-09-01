import { APP_CONTRACT } from './metadata'
import { formatDate } from '../utils'
import { ethers } from 'ethers'

export async function deployContract(
    signer: any,
    title: string,
    description: string,
    wei: any,
    recipientName: string,
    recipientAddress: string,
    cid: string,
    network: string
) {
    // Deploy contract with ethers
    const factory = new ethers.ContractFactory(
        APP_CONTRACT.abi,
        APP_CONTRACT.bytecode,
        signer
    )

    const ethToWei = (amount: any) => {
        return ethers.parseEther(amount + '')
    }

    const balance = ethToWei(wei)
    console.log('balance', balance, wei)

    let contract: any = await factory.deploy(
        title,
        description,
        balance,
        recipientName,
        recipientAddress,
        cid,
        network
    )
    // log
    console.log(
        'Deploying contract...',
        title,
        description,
        balance,
        recipientName,
        recipientAddress,
        cid,
        network
    )

    contract = await contract.waitForDeployment()
    console.log('deployed contract...', contract.target)
    return contract.target
}

export const getMetadata = async (signer: any, address: string) => {
    const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
    const result = await (contract.getMetadata as any).call()
    console.log('result', result)
    return {
        name: result[0],
        description: result[1],
        versionCount: result[2].toNumber(),
        createdAt: formatDate(result[3].toNumber() * 1000),
        owner: result[4],
    }
}

export const validate = async (signer: any, address: string) => {
    const contract = new ethers.Contract(address, APP_CONTRACT.abi, signer)
    const result = await contract.validate()
    console.log('result', result)
    return {
        creator: result[0],
        dataHash: result[1],
        timestamp: formatDate(result[2].toNumber() * 1000),
        version: result[3].toNumber(),
        cid: result[4],
        notes: result[5],
    }
}
