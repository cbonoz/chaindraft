import React from "react"

interface Props {
	value: number
}

const GradientBar = ({ value }: Props) => {
	// Ensure the value is between 1 and 10
	const clampedValue = Math.max(1, Math.min(value, 10))

	// Calculate the percentage height for the indicator
	const percentageHeight = ((clampedValue - 1) / 9) * 100

	return (
		<span className="relative w-12 h-64 bg-gradient-to-t from-red-500 to-green-500 border border-gray-300 rounded">
			<span
				className="absolute bottom-0 left-0 right-0 bg-white text-center text-black font-bold"
				style={{ height: `${percentageHeight}%` }}
			>
				<span>{clampedValue}</span>
			</span>
		</span>
	)
}

export default GradientBar
