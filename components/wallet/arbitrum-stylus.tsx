import { defineChain } from 'viem'

export const arbitrumStylus = /*#__PURE__*/ defineChain({
    id: 23011913,
    name: 'Arbitrum Stylus',
    nativeCurrency: {
        name: 'Arbitrum Stylus Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://stylus-testnet.arbitrum.io/rpc'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Stylus Arbiscan',
            url: 'https://stylus-testnet-explorer.arbitrum.io/',
            apiUrl: 'https://api-sepolia.arbiscan.io/api',
        },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 81930,
        },
    },
    testnet: true,
})
