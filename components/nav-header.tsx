import ConnectWallet from "./wallet/connect-wallet"
import { SwitchNetwork } from "./wallet/switch-network"

const NavHeader = () => {

	const isAdmin = process.env.NEXT_PUB

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
				{}
				{/* |
				<a href="/about" className="text-green-500 hover:underline mx-4">
					About
				</a> */}
				{/* align right */}
			</nav>
			<span className="ml-auto align-right justify-end">
				<SwitchNetwork />
			</span>
			<span className="align-right justify-end">
				<ConnectWallet />
			</span>
		</header>
	)
}

export default NavHeader
