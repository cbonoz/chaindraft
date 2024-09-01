"use client"

import { Web3AuthProvider } from "@/context/Web3AuthContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { ReactNode } from "react"

type Props = {
	children: ReactNode
	initialState: {}
}

const queryClient = new QueryClient()

export function Providers({ children, initialState }: Props) {
	return (
		<Web3AuthProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</Web3AuthProvider>
	)
}
