import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Head from "next/head"
import Script from "next/script"
import "./globals.css"
import NavHeader from "@/components/nav-header"
import { Providers } from "./providers"
import { headers } from "next/headers"
import { siteConfig } from "@/util/site-config"
import NavFooter from '@/components/nav-footer'
const inter = Inter({ subsets: ["latin"] })

// {/* https://docs.saturn.tech/fetching-from-saturn#0fd2ebd8ca11499891917dde4c04fc91 */} */}
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const initialState = {}

	return (
		<html lang="en">
			<Providers initialState={initialState}>
				<body className={inter.className}>
					<NavHeader />
					<div>{children}</div>
					{/* footer */}
					<NavFooter/>

				</body>
			</Providers>
		</html>
	)
}
