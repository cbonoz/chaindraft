/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"images.unsplash.com",
			"tailwindui.com",
			"res.cloudinary.com",
			"imgbb.com",
			"static.www.nfl.com",
		],
	},
	experimental: {
		serverComponentsExternalPackages: ["@xmtp/user-preferences-bindings-wasm"],
	},
	webpack: (config) => {
		config.externals.push("pino-pretty", "lokijs", "encoding")
		return config
	},
}

export default nextConfig
