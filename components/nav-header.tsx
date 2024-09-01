"use client"
import React from "react"
import { useWeb3AuthContext } from "../context/Web3AuthContext"
import ConnectWallet from "./wallet/connect-wallet"

const NavHeader = () => {
	const { provider, address } = useWeb3AuthContext()
	const isAdmin =
		address !== null && process.env.NEXT_PUBLIC_ADMIN_ADDRESS === address

	return (
		<header className="flex items-center h-16 bg-white-800 text-black px-4  border-b-4 border-green-500 sticky top-0 z-50 bg-white">
			<a href="/" className="block">
				<img
					src="/logo.png"
					alt="Chaindraft Logo"
					className="h-8 w-auto fill-current"
				/>
			</a>
			{/* <span className="ml-4 text-xl font-bold">Chaindraft</span> */}
			<nav className="flex align-center justify-center align-center center align-middle justify-middle">
				<a href="/create" className="text-green-500 hover:underline mx-4">
					Create contest
				</a>
				|
				<a href="/contest" className="text-green-500 hover:underline mx-4">
					Participate
				</a>
				{isAdmin && (
					<span>
						|
						<a href="/admin" className="text-green-500 hover:underline mx-4">
							Admin
						</a>
					</span>
				)}
			</nav>
			{/* <span className="ml-auto align-right justify-end">
				<SwitchNetwork />
			</span> */}
			<span className="align-right justify-end">
				<ConnectWallet />
			</span>
		</header>
	)
}

export default NavHeader
