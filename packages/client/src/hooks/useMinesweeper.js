import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import axios from "axios"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";

import { host, minesweeperAddress, websocketUrl, gameItemAddress } from "../constants";
import { AccountContext } from "./useAccount"
import MinesweeperABI from "../abi/Minesweeper.json"
import GameItemABI from "../abi/GameItem.json"

import { tileNumberToVal } from "../helpers"

export const MinesweeperContext = createContext()

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            loading: true,
            gameId: undefined,
            hash: undefined,
            smileyButton: undefined,
            minesCounter: undefined,
            gameStarted: false,
            gameEnded: false,
            flags: 0
        }
    )

    const { loading, gameId, smileyButton, minesCounter, gameStarted, hash, gameEnded, flags } = values

    const { account, library } = useWeb3React()
    const { corrected } = useContext(AccountContext)

    const [state, setState] = useState([]);

    useEffect(() => {
        loadGame()
    }, [])

    useEffect(() => {
        hash && loadTiles()
    }, [hash])

    useEffect(() => {

        const provider = new ethers.providers.WebSocketProvider(websocketUrl)
        const contract = new ethers.Contract(minesweeperAddress, MinesweeperABI, provider)

        const onChangeHandler = (gameId, position, cellData, button, fromAddress) => {
            console.log("Change called");

            const updated = state.map((val, index) => {
                if (index === Number(position)) {
                    val = tileNumberToVal(cellData)
                }
                return val
            })
            setState(updated)
            dispatch({ smileyButton: Number(button) })

            if ([5,6].includes(Number(cellData))) {
                console.log("load tile again")
                loadTiles()
            }
            if ([2].includes(Number(cellData))) { 
                loadGame()
            }

        };

        contract.on("Revealed", onChangeHandler) 

        return () => contract.removeAllListeners()
    }, [state]);

    const loadGame = useCallback(async () => {
        console.log("load new game...")

        const provider = new ethers.providers.WebSocketProvider(websocketUrl)
        const contract = new ethers.Contract(minesweeperAddress, MinesweeperABI, provider);

        const currentGameId = await contract.currentGameId()
        const result = await contract.getGameState(currentGameId)
        const flags = await contract.totalFlags()

        dispatch({
            gameId: Number(currentGameId),
            smileyButton: Number(result['smileyButton']),
            minesCounter: Number(result['minesCounter']),
            gameStarted: result['gameStarted'],
            gameEnded: result['gameEnded'],
            flags: Number(flags),
            hash: result['solution']
        })

    }, [])

    const loadTiles = useCallback(async () => {
        const { data } = await axios.get(`${host}/state/${hash}`)
        const { state } = data
        setState(state)

    }, [hash])

    const revealTile = useCallback(async (coordinates) => {

        if (!corrected) {
            alert("Wallet is not connected")
            return
        }

        const position = (coordinates.y * 16) + coordinates.x
        const contract = new ethers.Contract(minesweeperAddress, MinesweeperABI, library.getSigner());

        await contract.press(position)

        const updated = state.map((val, index) => {
            if (index === position) {
                val = "pressed"
            }
            return val
        })
        setState(updated)

    }, [corrected, library, state])

    const flagTile = useCallback(async (coordinates) => {

        if (!corrected) {
            alert("Wallet is not connected")
            return
        }

        // checking approval first
        const nft = new ethers.Contract(gameItemAddress, GameItemABI, library.getSigner());

        const approved = await nft.isApprovedForAll(account, minesweeperAddress)

        if (!approved) {
            const tx = await nft.setApprovalForAll(minesweeperAddress, true)
            await tx.wait()
        }

        const contract = new ethers.Contract(minesweeperAddress, MinesweeperABI, library.getSigner());

        const position = (coordinates.y * 16) + coordinates.x
        await contract.flag(position)

        const updated = state.map((val, index) => {
            if (index === position) {
                val = "pressed"
            }
            return val
        })
        setState(updated)

    }, [account, library, state])

    const newGame = useCallback(async () => {
        
        const signature = await library.getSigner().signMessage("MINESWEEPER")

        const payload = {
            gameId:  "MINESWEEPER",
            signature 
        }

        await axios.post(`${host}/new`, payload)

        console.log("done and try to load new game")

        loadGame()
    },[library])

    const minesweeperContext = useMemo(
        () => ({
            loading,
            gameId,
            state,
            smileyButton,
            minesCounter,
            gameStarted,
            gameEnded,
            flags,
            revealTile,
            flagTile,
            newGame
        }),
        [
            loading,
            gameId,
            state,
            smileyButton,
            minesCounter,
            gameStarted,
            gameEnded,
            flags,
            revealTile,
            flagTile,
            newGame
        ]
    )

    return (
        <MinesweeperContext.Provider value={minesweeperContext}>
            {children}
        </MinesweeperContext.Provider>
    )
}

export default Provider