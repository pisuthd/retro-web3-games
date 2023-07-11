import { InjectedConnector } from "@web3-react/injected-connector"

export const injected = new InjectedConnector()

export const SUPPORT_CHAINS = [20197]

export const Connectors = [
    {
        name: "MetaMask",
        connector: injected
    }
]

export const contractAddress = "0xB2987B64f29E194b6134255bC960Da91183a06B0"

export const host = "http://localhost:8000"