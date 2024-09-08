"use client"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { siteConfig } from "@/util/site-config"
import ViewContract from "./view-contract"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

interface Props {
	showNetwork?: boolean
}

const NavFooter = ({ showNetwork }: Props) => {
	const { activeChain } = useWeb3AuthContext()

	const networkName = activeChain?.displayName

	return (
		<footer className="bg-white-800 text-black text-center p-4 mt-8">
			<div className="flex justify-center">
				{siteConfig.title} ©{new Date().getFullYear()}
				{showNetwork && networkName && (
					<span className="ml-2"> - Active network: {networkName}</span>
				)}
				{false && (
					<span>
						&nbsp;|&nbsp;
						<span>
							<a
								href="https://github.com/cbonoz/chaindraft"
								target="_blank"
								rel="noopener noreferrer"
							>
								<GitHubLogoIcon className="h-6 w-6" />
							</a>
						</span>
					</span>
				)}
			</div>
			<ViewContract />
		</footer>
	)
}

export default NavFooter
