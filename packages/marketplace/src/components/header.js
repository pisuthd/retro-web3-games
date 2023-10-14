import { ExternalLink } from "react-feather"
import Link from "next/link"
import { useRouter } from 'next/router'
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'

const injected = injectedModule()

// initialize Onboard
init({ 
    wallets: [injected],
    chains: [
        // {
        //     id:  97,
        //     token: 'BNB',
        //     label: 'BNB Testnet',
        //     rpcUrl: "https://bsc-testnet.public.blastapi.io"
        // },
        {
            id: 247253,
            token: 'OAS',
            label: 'Saakuru Testnet',
            rpcUrl: 'https://rpc-testnet.saakuru.network'
        }
    ]
})


const Header = () => {

    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

    const router = useRouter()

    const { pathname } = router

    return (
        <nav class="w-full mx-auto max-w-screen-xl p-2 pb-1 md:flex md:items-center md:justify-between">
            <div class=" flex flex-wrap items-center justify-between mx-auto p-2 w-full">
                <div class="flex items-center">
                    <a href="https://retroweb3.games">
                        <img src="/logo.png" class="mr-3" style={{ width: "225px" }} alt="Logo" />
                    </a>
                    <Link href="/" class={`self-center hover:text-white hover:underline whitespace-nowrap ${pathname === "/" && "underline font-bold"}`}>Home</Link>
                </div>
                <div class="w-auto" id="navbar-default">
                    <ul class="font-medium flex flex-row p-4 md:p-0 mt-4 border  rounded-lg   md:flex-row md:space-x-8 md:mt-0 md:border-0   ">
                        <li class="mt-auto mb-auto">
                            <Link href="/items" class={`block py-2 pl-3 pr-4 rounded hover:underline hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent ${pathname === "/items" && "underline font-bold"}`}>All Items</Link>
                        </li>
                        <li class="mt-auto mb-auto">
                            <Link href="/magic-pass" class={`block py-2 pl-3 pr-4 rounded hover:underline hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent ${pathname === "/magic-pass" && "underline font-bold"}`}>Magic Pass</Link>
                        </li>
                        <li class="mt-auto mb-auto">
                            <Link href="https://console.retroweb3.games" class="flex flex-row hover:underline py-2 pl-3 pr-4 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Console{` `}
                                <ExternalLink size={16} class="m-auto ml-1" />
                            </Link>
                        </li>
                        <li>
                            <button disabled={connecting} class="bg-transparent   hover:text-white hover:underline py-2 px-4 border border-[#abd7ff] rounded" onClick={() => (wallet ? disconnect(wallet) : connect())}>
                                {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect Wallet'}
                            </button>
                        </li>
                    </ul>
                </div>

            </div>

        </nav>
    )
}

export default Header