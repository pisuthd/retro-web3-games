import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import axios from "axios"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";
import { MinesweeperContext } from "./useMinesweeper";

import TomoSitterABI from "../abi/TomoSitter.json"
import GameItemABI from "../abi/GameItem.json"
import { tomoSitterAddress, websocketUrl, gameItemAddress } from "../constants";
import { InventoryContext } from "./useInventory";

export const TomoContext = createContext()

const TOMO_NFT = "0x8df3ae96e378e1470dd9bdc388fe43e41eb68ce0"

const Provider = ({ children }) => {

    const [tokens, setTokens] = useState([])
    const [myColllections, setMyCollections] = useState([])

    const { hash } = useContext(MinesweeperContext)
    const { getInfo, collections } = useContext(InventoryContext)
    const { account, library } = useWeb3React()

    useEffect(() => {
        hash && loadTokens()
    }, [hash])

    useEffect(() => {
        collections && loadMyCollections(collections.filter(item => item.address === TOMO_NFT))
    }, [collections.length])

    const loadMyCollections = useCallback(async (collections) => {

        let collectionData = []

        for (let col of collections) {
            const data = await getInfo(col.tokenType, TOMO_NFT, col.tokenId, library.getSigner())
            collectionData.push({
                ...data,
                tokenId : col.tokenId
            })
        }

        setMyCollections(collectionData)
    }, [library])

    const loadTokens = useCallback(async () => {

        const provider = new ethers.providers.WebSocketProvider(websocketUrl)

        const contract = new ethers.Contract(
            tomoSitterAddress,
            TomoSitterABI,
            provider
        )

        const tokenIds = await contract.currentLockedTokens()
        let tokenData = []

        for (let tokenId of tokenIds) {
            const id = Number(tokenId)
            const data = await getInfo("ERC721", TOMO_NFT, id, provider)
            tokenData.push({
                ...data,
                tokenId: id
            })
        }
        setTokens(tokenData)
    }, [])


    const checkOwner = useCallback(async (tokenId) => {

        const provider = new ethers.providers.WebSocketProvider(websocketUrl)

        const contract = new ethers.Contract(
            tomoSitterAddress,
            TomoSitterABI,
            provider
        )

        const owner = await contract.shared(tokenId)
        
        return owner;
    }, [])
    
    const lock = useCallback(async (tokenId) => {

        const nft = new ethers.Contract(TOMO_NFT, GameItemABI, library.getSigner());
        const approved = await nft.isApprovedForAll(account, tomoSitterAddress)

        if (!approved) {
            const tx = await nft.setApprovalForAll(tomoSitterAddress, true)
            await tx.wait()
        }

        const contract = new ethers.Contract(tomoSitterAddress, TomoSitterABI, library.getSigner());

        const tx = await contract.lock(tokenId)
        await tx.wait()

    },[account, library])

    const unlock = useCallback(async (tokenId) => {

        const contract = new ethers.Contract(tomoSitterAddress, TomoSitterABI, library.getSigner());
        const tx = await contract.unlock(tokenId)
        await tx.wait()

    },[library])
    
    const tomoContext = useMemo(
        () => ({
            tokens,
            myColllections,
            checkOwner,
            lock,
            unlock
        }),
        [
            tokens,
            myColllections,
            lock,
            unlock
        ]
    )

    return (
        <TomoContext.Provider value={tomoContext}>
            {children}
        </TomoContext.Provider>
    )
}

export default Provider