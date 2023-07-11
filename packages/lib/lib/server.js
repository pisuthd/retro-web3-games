import { ethers } from "ethers";
import { buildPoseidon } from "circomlibjs"
import { random, getIndexFromCoordinates } from "./helpers"
import { Base } from "./base"
import { DEFAULT_MESSAGE, ACTIVE_GAMES_TABLE } from "./constants";
import { plonk } from "snarkjs"
import MinesweeperABI from "./abi/Minesweeper.json"

import { handleAction, initMineField, initBlankField, Cell, addFlag } from "./minesweeper";

export class ServerLib extends Base {

    provider

    constructor(args) {
        super()

        if (args && args.provider) {
            this.provider = args.provider
        }
        // if (args && args.contractAddress) {
        //     this.contractAddress = args.contractAddress
        // }

    }

    requestGameCreation = async (mines = 40) => {

        const mineField = initMineField(16, 16, random(0, 16), random(0, 16), mines).map((item) => {
            if (item === "x") {
                return 10
            } else {
                return Number(item)
            }
        })

        

        const initField = initBlankField(16, 16)
        const commitment = await this.hashItems(mineField)

        const db = this.getDb(ACTIVE_GAMES_TABLE)

        const game = await this.getActiveGame(commitment)
        if (game) {
            await db.remove(game)
        }

        await db.put({
            _id: `${commitment}`,
            solution: mineField,
            state: initField
        })

        return `${commitment}`
    }

    state = async (commitment) => {
        const game = await this.getActiveGame(commitment)
        if (!game) {
            throw new Error("There is no state from the given commitment")
        }
        return game.state.map((item) => {
            if (item === 0) {
                return Cell.blank
            }
            return item
        })
    }

    getActiveGame = async (commitment) => {
        const db = this.getDb(ACTIVE_GAMES_TABLE)

        let activeGame

        try {
            activeGame = await db.get(commitment)
            // has active game
        } catch (e) {
            // no active game
        }
        return activeGame
    }

    getBlockNumber = async () => {
        return this.provider.getBlockNumber()
    }

    generateProof = async (commitment, position) => {

        const game = await this.getActiveGame(commitment)

        if (!game) {
            throw new Error("There is no state from the given commitment")
        }

        const prove = await plonk.fullProve(
            {
                position,
                solved: game.state.map((item) => {
                    if (item === Cell.open0) item = 0
                    if (item === Cell.open1) item = 1
                    if (item === Cell.open2) item = 2
                    if (item === Cell.open3) item = 3
                    if (item === Cell.open4) item = 4
                    if (item === Cell.open5) item = 5
                    if (item === Cell.open6) item = 6
                    if (item === Cell.open7) item = 7
                    if (item === Cell.open8) item = 8
                    if (item === Cell.bombdeath) item = 10
                    if (item === Cell.bombrevealed) item = 10
                    if (item === Cell.bombflagged) item = 10
                    if (item === Cell.blank) item = 0
                    return item
                }),
                solution: game.solution,
                commitment,
                solutionAtPosition: game.solution[position]
            },
            `./circuits/puzzle.wasm`,
            `./circuits/puzzle.zkey`
        )

        return {
            proof: await this.proveToProof(prove),
            publicSignals: prove.publicSignals
        }
    }

    proveToProof = async (prove) => {
        const calldata = await plonk.exportSolidityCallData(prove.proof, prove.publicSignals)
        const proof = JSON.parse(calldata.substring(0, calldata.indexOf("]") + 1))
        return proof
    }

    updateState = async (commitment, hash, flag = false) => {
        if (!this.provider) {
            throw new Error("Provider is not set!")
        }

        // console.log("checking tx : ", hash)

        const txInfo = await this.provider.getTransaction(hash);

        let position

        if (!flag) {
            const iface = new ethers.utils.Interface(['function reveal(uint8 position, uint256[24] proof, uint256[2] calldata publicSignals)'])
            const input = iface.decodeFunctionData('reveal', txInfo.data)
            position = input[0]

            const game = await this.getActiveGame(commitment)

            if (!game) {
                throw new Error("There is no state from the given commitment")
            }

            const { state, solution } = game

            const updatedState = handleAction(state, solution, position)

            // update state on db
            const db = this.getDb(ACTIVE_GAMES_TABLE)

            await db.put({
                _id: `${commitment}`,
                _rev: game["_rev"],
                solution: game["solution"],
                state: updatedState
            })

        } else {

            const iface = new ethers.utils.Interface(['function flag(uint8 position, uint256[24] proof, uint256[2] calldata publicSignals)'])
            const input = iface.decodeFunctionData('flag', txInfo.data)
            position = input[0]

            const game = await this.getActiveGame(commitment)

            if (!game) {
                throw new Error("There is no state from the given commitment")
            }

            const { state, solution } = game

            const updatedState = addFlag(state, solution, position)

            // update state on db
            const db = this.getDb(ACTIVE_GAMES_TABLE)

            await db.put({
                _id: `${commitment}`,
                _rev: game["_rev"],
                solution: game["solution"],
                state: updatedState
            })

        }



    }


}

