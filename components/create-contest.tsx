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
import { Calendar } from "@/components/ui/calendar"
import { cn, getReadableError } from "@/lib/utils"
import { CalendarIcon, ReloadIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useWeb3AuthContext } from "@/context/Web3AuthContext"

const CreateContest = () => {
	const [data, setData] = useState<RequestData>({})
	const [result, setResult] = useState({} as any)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const { address, provider, activeChain } = useWeb3AuthContext()

	const setDemoData = () => {
		setData({ ...DEFAULT_CONTEST })
	}

	const clear = () => {
		setData({})
	}

	const submit = async () => {
		console.log(data)

		try {
			setLoading(true)
			// await createContest(data)
			setResult({
				success: true,
				message: "Contest created successfully!",
			})
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

	return (
		<div className="w-full max-w-[1000px]">
			<div className="flex flex-row items-center justify-center mt-8">
				<BasicCard
					title="Create a contest"
					description={
						<span>
							Create a new contest and invite your friends to join.
							<br />
							Network: {activeChain.displayName || "Ethereum"}
						</span>
					}
					className="min-w-[400px] p-4"
				>
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
						placeholder={`Enter entry fee in ${activeChain?.tickerName || "ETH"}`}
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

					<br />

					{address && <div>{address}</div>}

					<Button
						onClick={submit}
						className="mt-4"
						disabled={
							!data.name || !data.entryFee || !data.closeDateMillis || loading
						}
					>
						{loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
						Create contest&nbsp;
						<CiFootball size={"medium"} />
					</Button>

					{error && <div className="text-red-500 mt-4">{error}</div>}
				</BasicCard>
			</div>
		</div>
	)
}

export default CreateContest
