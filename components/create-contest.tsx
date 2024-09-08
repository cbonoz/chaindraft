"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import BasicCard from "./basic-card"
import { CiFootball } from "react-icons/ci"
import { RequestData } from "@/lib/types"
import { DEFAULT_CONTEST } from "@/lib/constants"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"

import { Calendar } from "@/components/ui/calendar"
import { cn, getContestIdFromLogs, getReadableError } from "@/lib/utils"
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"
import { createContest } from "@/lib/contract/commands"
import { CHAIN_OPTIONS } from "@/lib/chains"
import RenderObject from "./render-object"
import MultipleSelector from "./ui/multi-selector"
import { ALL_TEAMS, TEAM_OPTIONS } from "@/lib/data/players"

const CreateContest = () => {
	const [data, setData] = useState<RequestData>({ allowedTeams: [] })
	const [result, setResult] = useState({} as any)
	const [modalData, setModalData] = useState({} as any)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const { address, signer, provider, activeChain } = useWeb3AuthContext()

	const setDemoData = () => {
		setData({ ...DEFAULT_CONTEST })
	}

	const clear = () => {
		setData({})
	}

	function getFormError() {
		if (!data.name) return "Please enter a contest name"
		if (!data.entryFee) return "Please enter an entry fee"
		if (!data.closeDateMillis) return "Please enter a submission close date"
		return ""
	}

	const submit = async () => {
		console.log(data)
		setError("")

		const formError = getFormError()
		if (formError) {
			setError(formError)
			return
		}

		if (!signer) {
			setError("Please connect your wallet")
			return
		}

		try {
			setLoading(true)
			const res = await createContest(
				signer,
				activeChain?.chainId || CHAIN_OPTIONS[0].chainId,
				data
			)
			res["success"] = true
			res["contestId"] = getContestIdFromLogs(res)
			console.log("res", res)
			setResult(res)
		} catch (err: any) {
			console.error(err)
			setError(getReadableError(err))
		} finally {
			setLoading(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		})
	}

	const hasResult = Object.keys(result || {}).length > 0

	return (
		<div className="w-full max-w-[1000px]">
			<div className="flex flex-row items-center justify-center mt-8">
				<BasicCard
					title="Create new fantasy contest"
					description={
						<span>
							Create a new contest and invite your friends and family to
							participate. You will be the admin of the contest.
							<br />
							Network: {activeChain?.displayName || "Ethereum"}
						</span>
					}
					className="min-w-[400px] p-4"
				>
					{hasResult && (
						<div>
							<div className="text-green-500">
								<Dialog>
									<DialogTrigger className="underline">
										View Transaction Details
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Contest created</DialogTitle>
											{/* word wrap */}
											<DialogDescription className="break-all">
												<RenderObject
													obj={result}
													title={result?.success ? "Success!" : "Error!"}
												/>
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>
								<br />
								{/* Go to contest */}
								<Button
									className="mt-4"
									onClick={(e) => {
										e?.preventDefault()
										window.open(`/contest/${result.contestId}`, "_blank")
									}}
								>
									Go to contest
								</Button>
							</div>
							<div className="mt-4">
								Share the link to the contest with your friends and family.
							</div>
						</div>
					)}
					{!hasResult && (
						<div className="form-content">
							{/* contest name */}
							<Input
								placeholder="Enter contest name"
								name="name"
								className="mt-4"
								value={data.name}
								onChange={handleChange}
							/>

							{/* prize */}
							<Input
								className="mt-4"
								placeholder={`Enter entry fee in ${activeChain?.tickerName || "ETH"}. Use 0 for free entry.`}
								name="entryFee"
								value={data.entryFee}
								onChange={handleChange}
							/>

							{/* close date */}
							{/* https://ui.shadcn.com/docs/components/date-picker */}
							<div className="mt-4 text-sm text-muted-foreground">
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant={"outline"}
											className={cn(
												"w-[280px] justify-start text-left font-normal",
												!data.closeDateMillis && "text-muted-foreground"
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{data.closeDateMillis ? (
												format(data.closeDateMillis, "PPP")
											) : (
												<span>Submission close date</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={new Date(data.closeDateMillis || Date.now())}
											onSelect={(date) =>
												handleChange({
													target: { name: "closeDateMillis", value: date },
												} as any)
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>

							{/* teams */}
							<div className="w-full mt-4">
								<MultipleSelector
									value={data.allowedTeams}
									onChange={(allowedTeams) =>
										setData({ ...data, allowedTeams })
									}
									defaultOptions={TEAM_OPTIONS}
									placeholder="Select teams for draft if blank all enabled (ex: season long)"
									emptyIndicator={
										<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
											No results found.
										</p>
									}
								/>
							</div>

							{/* passcode */}
							<Input
								placeholder="Add contest passcode (optional)"
								name="passcode"
								className="mt-4"
								value={data.passcode}
								onChange={handleChange}
							/>

							<Button
								onClick={submit}
								className="mt-4 bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded cursor-pointer pointer"
								disabled={loading}
							>
								Create contest&nbsp;
								{!loading && <CiFootball size={"medium"} />}
								{loading && (
									<span className="animate-spin ml-1">
										<ReloadIcon />
									</span>
								)}
							</Button>
						</div>
					)}
					<br />

					{/* {address && <div>{address}</div>} */}

					{error && <div className="text-red-500 mt-4">{error}</div>}
				</BasicCard>
			</div>
		</div>
	)
}

export default CreateContest
