import { InjectedConnector } from "@web3-react/injected-connector"

export const injected = new InjectedConnector()

export const SUPPORT_CHAINS = [247253]

export const Connectors = [
    {
        name: "MetaMask",
        connector: injected
    }
]

export const ERC721_COLLECTIONS = ["0x8df3ae96e378e1470dd9bdc388fe43e41eb68ce0"] // TomoONE
export const ERC1155_COLLECTIONS = ["0xCFFcB7982f9831Ac805a83F61D701Bfd5340c2E6"]

export const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "0x3Fd0D595876c099eAeDA4A42e48fabdDe2a2b044"
export const faucetAddress = process.env.REACT_APP_FAUCET_ADDRESS || "0x13E6B05BD8D45aE843674F929A94Edd32BD5e3d9"
export const gameItemAddress = process.env.REACT_APP_GAME_ITEM_ADDRESS || "0xCFFcB7982f9831Ac805a83F61D701Bfd5340c2E6"
export const rpcUrl = process.env.REACT_APP_RPC_URL || "https://rpc-testnet.saakuru.network"

export const host = process.env.REACT_APP_HOST || "http://localhost:8000"