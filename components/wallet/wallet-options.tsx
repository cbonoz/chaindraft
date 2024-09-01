"use client"

import * as React from "react"
import { Connector, useConnect } from "wagmi"
import { Button } from "../ui/button"
import { read } from "fs"

export function WalletOptions() {
	const { connectors, connect } = useConnect()

	async function connectWallet({ connector }: any) {
		console.log("connect", connector)
		connect({ connector })
	}

	return connectors.map((connector) => (
		<WalletOption
			key={connector.uid}
			connector={connector}
			onClick={connectWallet.bind(null, { connector })}
		/>
	))
}

function WalletOption({
	connector,
	onClick,
}: {
	connector: Connector
	onClick: () => void
}) {
	const [ready, setReady] = React.useState(false)

	React.useEffect(() => {
		;(async () => {
			const provider = await connector.getProvider()
			setReady(!!provider)
		})()
	}, [connector])

	return (
		<Button
			variant={"secondary"}
			disabled={!ready}
			onClick={onClick}
			className="ml-2"
		>
			Connect wallet
		</Button>
	)
}
