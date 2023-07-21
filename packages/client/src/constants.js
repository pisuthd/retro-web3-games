import { InjectedConnector } from "@web3-react/injected-connector"

export const injected = new InjectedConnector()

export const SUPPORT_CHAINS = [20197]

export const Connectors = [
    {
        name: "MetaMask",
        connector: injected
    }
]

export const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x3Fd0D595876c099eAeDA4A42e48fabdDe2a2b044"

export const host = process.env.REACT_APP_HOST || "http://localhost:8000"