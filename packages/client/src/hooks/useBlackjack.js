import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import axios from "axios"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers";

import { host, blackjackAddress, websocketUrl, gameItemAddress } from "../constants"
import { AccountContext } from "./useAccount"
import GameItemABI from "../abi/GameItem.json"
import BlackjackABI from "../abi/Blackjack.json"

const TOKEN_ID = 2

export const BlackjackContext = createContext()

const Provider = ({ children }) => {

    const [values, dispatch] = useReducer(
        (curVal, newVal) => ({ ...curVal, ...newVal }),
        {
            game: undefined,
            balance: 0
        }
    )

    const { game, balance } = values

    const [tick, setTick] = useState(0)
    const { account, library } = useWeb3React()
    const { corrected } = useContext(AccountContext)

    useEffect(() => {
        corrected && account && loadGame(account)
    }, [corrected, account, tick])

    useEffect(() => {
        corrected && loadBalance()
    }, [corrected, tick])

    const loadGame = useCallback(async (account) => {

        try {
            const { data } = await axios.get(`${host}/state/${account}`)
            const { state } = data
            dispatch({ game: state })
        } catch (e) {
            dispatch({ game: undefined })
        }

    }, [])

    const delay = async (value) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, value)
        })
    }

    const loadBalance = useCallback(async () => {
        const contract = new ethers.Contract(gameItemAddress, GameItemABI, library.getSigner());

        const balance = await contract.balanceOf(account, TOKEN_ID)

        dispatch({ balance: Number(balance) })
    }, [account, library])

    const deal = useCallback(async (amount) => {

        console.log("deal#1")

        // checking approval first
        const nft = new ethers.Contract(gameItemAddress, GameItemABI, library.getSigner());
        const approved = await nft.isApprovedForAll(account, blackjackAddress)

        if (!approved) {
            const tx = await nft.setApprovalForAll(blackjackAddress, true)
            await tx.wait()
        }

        console.log("deal#2")

        const contract = new ethers.Contract(blackjackAddress, BlackjackABI, library.getSigner());

        const tx = await contract.deal(amount)
        await tx.wait()

        console.log("deal#3")

        while (true) {
            console.log("deal#looop")
            const game = await contract.games(account)
            const state = game["state"]

            await delay(500)

            if (Number(state) !== 0) {
                break
            }
        }

        setTick(tick + 1)
    }, [account, library, tick])

    const action = useCallback(async (actionType) => {

        const signature = await library.getSigner().signMessage(game.message)

        try {

            const payload = {
                signature,
                account,
                actionType
            }

            await axios.post(`${host}/action`, payload)

            const updated = await axios.get(`${host}/state/${account}`)
            const { state } = updated.data
            dispatch({ game: state })

            setTick(tick + 1)
        } catch (e) {
            console.log(e)
        }

    }, [account, library, tick, game])

    const blackjackContext = useMemo(
        () => ({
            game,
            balance,
            deal,
            action
        }),
        [
            game,
            balance,
            deal,
            action
        ]
    )

    return (
        <BlackjackContext.Provider value={blackjackContext}>
            {children}
        </BlackjackContext.Provider>
    )
}

export default Provider