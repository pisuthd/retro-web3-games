import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";
import axios from "axios"
import { AccountContext } from "./useAccount"
import { ERC1155_COLLECTIONS, ERC721_COLLECTIONS, rpcUrl } from "../constants";
import { isAddressesEqual } from "../helpers"
import GameItemABI from "../abi/GameItem.json"


export const InventoryContext = createContext()

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            loading: true,
            tick: 0,
            collections: []
        }
    )

    const {
        tick,
        loading,
        collections
    } = values

    const { account, library } = useWeb3React()
    const { corrected } = useContext(AccountContext)

    useEffect(() => {
        corrected && loadAllCollection()
    }, [corrected, tick])

    const getInfo = useCallback(async (tokenType, address, tokenId) => {

        const contract = new ethers.Contract(address, GameItemABI, library.getSigner());

        let uri = tokenType === "ERC1155" ? (await contract.uri(tokenId)) : (await contract.tokenURI(tokenId))

        uri = uri.replace(/ /g, '')

        let json

        const gatewayList = [
            "https://cloudflare-ipfs.com/ipfs/",
            "https://nftstorage.link/ipfs/",
            "https://ipfs.eth.aragon.network/ipfs/",
            "https://cf-ipfs.com/ipfs/"
        ]

        if (uri.includes("ipfs://")) {
            const gateway = gatewayList[Math.floor(Math.random() * gatewayList.length)]
            const { data } = await axios.get(`${gateway}${uri.replaceAll("ipfs://", "")}`)
            json = data
        } else {
            const { data } = await axios.get(`${uri}`)
            json = data
        }
        
        // override IPFS for images
        if (json && json.image && json.image.includes("ipfs://")) {
            const gateway = gatewayList[Math.floor(Math.random() * gatewayList.length)]
            json.image = `${gateway}${json.image.replaceAll("ipfs://", "")}`
        }

        if (address === "0x8df3ae96e378e1470dd9bdc388fe43e41eb68ce0") {
            json.application = "TomoOne"
        }

        return json
    }, [library])

    const loadAllCollection = useCallback(async () => {

        let collections = []

        dispatch({ collections, loading: true })

        const holderAddress = account

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)

        // check ERC721 first
        for (const address of ERC721_COLLECTIONS) {

            const contract = new ethers.Contract(
                address,
                ERC721TransferAbi,
                provider
            )

            const sentLogs = await contract.queryFilter(
                contract.filters.Transfer(holderAddress, null)
            )

            const receivedLogs = await contract.queryFilter(
                contract.filters.Transfer(null, holderAddress)
            )

            const logs = sentLogs
                .concat(receivedLogs)
                .sort(
                    (a, b) =>
                        a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex
                )

            const owned = new Set()

            for (const log of logs) {
                if (log.args) {
                    const { from, to, tokenId } = log.args

                    if (isAddressesEqual(to, holderAddress)) {
                        owned.add(Number(tokenId))
                    } else if (isAddressesEqual(from, holderAddress)) {
                        owned.delete(Number(tokenId))
                    }
                }
            }

            Array.from(owned).map(tokenId => {
                collections.push({
                    tokenId,
                    address,
                    tokenType: "ERC721",
                    value: 1
                })
            })

        }

        // check ERC1155
        for (const address of ERC1155_COLLECTIONS) {
            const contract = new ethers.Contract(
                address,
                ERC1155TransferSingleAbi,
                provider
            )

            const sentLogs = await contract.queryFilter(
                contract.filters.TransferSingle(holderAddress, null)
            )

            const receivedLogs = await contract.queryFilter(
                contract.filters.TransferSingle(null, holderAddress)
            )

            const logs = sentLogs
                .concat(receivedLogs)
                .sort(
                    (a, b) =>
                        a.blockNumber - b.blockNumber || a.transactionIndex - b.transactionIndex
                )

            const owned = {}

            for (const log of logs) {
                if (log.args) {
                    const { from, to, id, value } = log.args

                    if (isAddressesEqual(to, holderAddress)) {
                        if (!owned[Number(id)]) {
                            owned[Number(id)] = 0
                        }
                        owned[Number(id)] += Number(value)
                    } else if (isAddressesEqual(from, holderAddress)) {
                        if (!owned[Number(id)]) {
                            owned[Number(id)] = 0
                        }
                        owned[Number(id)] -= Number(value)
                    }
                }
            }

            Object.keys(owned).map(tokenId => {
                collections.push({
                    tokenId: Number(tokenId),
                    address,
                    tokenType: "ERC1155",
                    value: owned[tokenId]
                })
            })
        }

        dispatch({ collections, loading: false })

    }, [account, library])



    const inventoryContext = useMemo(
        () => ({
            collections,
            loading,
            getInfo
        }),
        [collections, loading, getInfo]
    )

    return (
        <InventoryContext.Provider value={inventoryContext}>
            {children}
        </InventoryContext.Provider>
    )
}

const ERC721TransferAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
]


const ERC1155TransferSingleAbi = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "TransferSingle",
        "type": "event"
    }
]

export default Provider