"use client"
// context/Web3AuthContext.tsx

import React, { createContext, useContext, ReactNode } from "react"
import useWeb3Auth from "./useWeb3Auth"

type Web3AuthContextType = ReturnType<typeof useWeb3Auth>

// Create a context with a default value of null
const Web3AuthContext = createContext<Web3AuthContextType | null>(null)

// Create a provider component
export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
	const web3Auth = useWeb3Auth()

	return (
		<Web3AuthContext.Provider value={web3Auth}>
			{children}
		</Web3AuthContext.Provider>
	)
}

// Custom hook to use the Web3Auth context
export const useWeb3AuthContext = () => {
	const context = useContext(Web3AuthContext)
	if (context === null) {
		throw new Error("useWeb3AuthContext must be used within a Web3AuthProvider")
	}
	return context
}
