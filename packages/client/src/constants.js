import { InjectedConnector } from "@web3-react/injected-connector"

export const injected = new InjectedConnector()

export const SUPPORT_CHAINS = [9372]

export const Connectors = [
    {
        name: "MetaMask",
        connector: injected
    }
]

// export const host = process.env.HOST