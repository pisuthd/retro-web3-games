import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import axios from "axios"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";
// import { buildPoseidon } from "circomlibjs"
import MinesweeperABI from "../abi/Minesweeper.json"
import { host, contractAddress } from "../constants";

import { AccountContext } from "./useAccount"

export const MinesweeperContext = createContext()

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            loading: true,
            gameId: undefined,
            commitment: undefined,
            smileyButton: undefined,
            minesCounter: undefined,
            state: undefined,
            gameStarted: false,
            deposit : "0" ,
            gameEnded: false
        }
    )

    const {
        loading,
        gameId,
        commitment,
        smileyButton,
        minesCounter,
        gameStarted,
        gameEnded,
        deposit,
        state
    } = values

    const { account, library } = useWeb3React()
    const { corrected } = useContext(AccountContext)

    useEffect(() => {
        corrected && loadCurrentGame()
    }, [corrected])

    const loadCurrentGame = useCallback(async (currentId) => {

        const contract = new ethers.Contract(contractAddress, MinesweeperABI, library.getSigner());

        const currentGameId = currentId || await contract.currentGameId()

        const result = await contract.games(currentGameId)

        const commitment = `${result["solution"]}`

        const { data } = await axios.get(`${host}/state/${commitment}`)

        const deposit = await library.getBalance(contractAddress)

        dispatch({
            loading: false,
            gameId: Number(currentGameId),
            commitment,
            smileyButton: Number(result['smileyButton']),
            minesCounter: Number(result['minesCounter']),
            gameStarted: result['gameStarted'],
            gameEnded: result['gameEnded'],
            state: data.state,
            deposit : ethers.utils.formatEther(deposit)
        })

    }, [library])

    const revealTile = useCallback(async (coordinates) => {

        console.log("generate proof for coordinates : ", coordinates)

        const position = (coordinates.y * 16) + coordinates.x

        const payload = {
            commitment,
            position,
        }

        console.log("position --> ", position)

        const { data } = await axios.post(`${host}/proof` , payload)
        const { proof, publicSignals } = data

        console.log("proof --> ", proof, publicSignals)

        const contract = new ethers.Contract(contractAddress, MinesweeperABI, library.getSigner());

        const tx = await contract.reveal(position, proof, publicSignals)

        await tx.wait()

        console.log("tx / commitment ", commitment, tx.hash)

        await axios.post(`${host}/update` , {
            commitment : `${commitment}`,
            tx : `${tx.hash}`
        })

        await loadCurrentGame(gameId)

    }, [commitment, gameId, library])

    const newGame = useCallback(async () => {

        const contract = new ethers.Contract(contractAddress, MinesweeperABI, library.getSigner());

        const { data } = await axios.get(`${host}/new`)
        const { commitment } = data

        const tx = await contract.create(commitment)

        await tx.wait()

        await loadCurrentGame()

    },[library])

    const flagTile = useCallback(async (coordinates) => {

        console.log("generate proof for coordinates : ", coordinates)

        const position = (coordinates.y * 16) + coordinates.x

        const payload = {
            commitment,
            position,
        }

        const { data } = await axios.post(`${host}/proof` , payload)
        const { proof, publicSignals } = data

        const contract = new ethers.Contract(contractAddress, MinesweeperABI, library.getSigner());

        const tx = await contract.flag(position, proof, publicSignals, {
            value : ethers.utils.parseEther("0.01")
        })

        await tx.wait()

        console.log("tx / commitment ", commitment, tx.hash)

        await axios.post(`${host}/update` , {
            commitment : `${commitment}`,
            tx : `${tx.hash}`,
            flag : true
        })

        await loadCurrentGame(gameId)

    }, [commitment,  gameId, library])

    const minesweeperContext = useMemo(
        () => ({
            loading,
            gameId,
            state,
            commitment,
            smileyButton,
            minesCounter,
            gameStarted,
            gameEnded,
            revealTile,
            flagTile,
            newGame,
            deposit
        }),
        [
            loading,
            gameId,
            state,
            commitment,
            smileyButton,
            minesCounter,
            gameStarted,
            gameEnded,
            revealTile,
            flagTile,
            newGame,
            deposit
        ]
    )

    return (
        <MinesweeperContext.Provider value={minesweeperContext}>
            {children}
        </MinesweeperContext.Provider>
    )
}

export default Provider