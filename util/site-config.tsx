export const siteConfig = {
	title: "Chaindraft",
	description:
		"A blockchain-based fantasy draft game with challenge-able contest pages",
	isLocal: process.env.NEXT_PUBLIC_ENV === "development",
	siteUrl: "https://vercel.chaindraft.com",
	maxDraftSkips: 10,
	numberDraftPlayers: 5,
	about: [
		{
			title: "What is Chaindraft?",
			description:
				"Chaindraft is a decentralized fantasy football app that leverages blockchain technology to offer a transparent and secure fantasy sports experience. It features community-driven decisions on player salaries and smart contract-based lineup management.",
		},
		{
			title: "How does it work?",
			description:
				"Chaindraft allows users to create contests and submit their fantasy football lineups. Smart contracts manage and automate contest entries, lineup submissions, and prize distributions. Each action is securely recorded on the blockchain to ensure fairness and transparency.",
		},
		{
			title: "Why should I use Chaindraft?",
			description:
				"Chaindraft empowers users with a direct influence on fantasy football contests through community voting on player salaries and contest outcomes. The decentralized nature of the platform ensures that all transactions and game rules are transparent, secure, and verifiable, providing an unparalleled gaming experience.",
		},
		{
			title: "Disclaimer",
			description:
				"Chaindraft is currently in the early stages of development and is provided as-is without any guarantees. Use at your own risk, and stay tuned for future updates and improvements.",
		},
	],
	steps: [
		{
			title: "Create Your Account",
			description:
				"Sign up and connect your digital wallet to participate. Secure your account and verify your identity using decentralized identity protocols.",
		},
		{
			title: "Join a Contest",
			description:
				"Create or join a fantasy football contest. Set your entry fee, optional passcode, and other contest details. Manage your lineups based on community-determined player salaries.",
		},
		{
			title: "Submit Your Lineup",
			description:
				"Submit your lineup of 5 players before the contest closes. Ensure your lineup meets the contest criteria and submit it before the deadline. The smart contract will handle all lineup validations and submissions.",
		},
		{
			title: "Participate and Win",
			description:
				"Compete against other participants and track the results. The contest owner will declare the winner based on the contest rules. The prize pool will be distributed automatically via smart contract.",
		},
	],
}
