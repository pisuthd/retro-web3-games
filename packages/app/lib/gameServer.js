const { ethers } = require("ethers")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

const { Database } = require("./db")
const { GAMES, ACTIVE_GAMES_TABLE } = require("./constants")

const { handleAction, initMineField, initBlankField, Cell, addFlag } = require("./helpers/minesweeper")
const { random, parseCellData } = require("./helpers/utils")
const MinesweeperABI = require("./abi/Minesweeper.json")

class GameServer extends Database {

    provider
    signer

    contracts

    constructor(args) {
        super()

        this.provider = args.provider
        this.signer = args.signer
        this.contracts = args.contracts

    }

    start = () => {
        if (!this.provider) {
            throw new Error("No provider has been set")
        }

        const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.provider)

        // contract.on("GameCreated", (gameId, solution) => {
        //     console.log("event ", gameId, solution)
        // });

        contract.on("Pressed", (gameId, position, player) => {
            this.revealMinesweeperBoard(gameId, position, player)
        });

        contract.on("Flagged", (gameId, position, player) => {
            this.revealMinesweeperBoard(gameId, position, player, true)
        });

    }

    stop = () => {

    }

    gameState = async (gameId) => {
        if (![GAMES.MINESWEEPER, GAMES.BLACKJACK].includes(gameId)) {
            throw new Error("Game ID not supported")
        }
        switch (gameId) {
            case GAMES.MINESWEEPER:
                return await this.currentMinesweeperState()
            case GAMES.BLACKJACK:
                break
            default:
                console.log("Invalid choice")
        }
    }

    requestGameCreation = async ({
        gameId,
        signature,
        difficulty // no. of mines 
    }) => {
        if (![GAMES.MINESWEEPER, GAMES.BLACKJACK].includes(gameId)) {
            throw new Error("Game ID not supported")
        }

        const recoveredAddress = ethers.verifyMessage(`${gameId}`, signature)

        switch (gameId) {
            case GAMES.MINESWEEPER:
                await this.createMinesweeperBoard(difficulty)
                break
            case GAMES.BLACKJACK:
                break
            default:
                console.log("Nothing to create")
        }

    }

    createMinesweeperBoard = async (mines = 20) => {

        if (!this.contracts[GAMES.MINESWEEPER]) {
            throw new Error("Contract is not set")
        }

        // now make the game
        const mineField = initMineField(16, 16, random(0, 16), random(0, 16), mines)

        const initField = initBlankField(16, 16)

        // construct merkle tree
        const tree = new MerkleTree(mineField.map(item => ethers.id(item)), keccak256, { sortPairs: true })
        const hexRoot = tree.getHexRoot();

        // settles on smart contract
        const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.signer)

        await contract.create(hexRoot, mines)

        const db = this.getDb(ACTIVE_GAMES_TABLE)

        const game = await this.getActiveGame(hexRoot)
        if (game) {
            await db.remove(game)
        }

        await db.put({
            _id: `${hexRoot}`,
            solution: mineField,
            state: initField
        })

        return `${hexRoot}`
    }

    revealMinesweeperBoard = async (gameId, position, fromAddress, isFlag = false) => {
        const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.signer)

        const gameState = await contract.getGameState(gameId)
        const hash = gameState['solution']
        const game = await this.getActiveGame(hash)
        const { state, solution } = game

        const updatedState = isFlag ? addFlag(state, solution, Number(position)) : handleAction(state, solution, Number(position))

        // update state on db
        const db = this.getDb(ACTIVE_GAMES_TABLE)

        await db.put({
            _id: `${hash}`,
            _rev: game["_rev"],
            solution: game["solution"],
            state: updatedState
        })

        const cellData = parseCellData(updatedState[position])

        console.log("cellData:", cellData, updatedState[position])

        // update state on smart contract
        await contract.reveal(gameId, position, cellData, fromAddress);

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

    currentMinesweeperState = async () => {
        if (!this.contracts[GAMES.MINESWEEPER]) {
            throw new Error("Contract is not set")
        }

        const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.signer)

        const hash = await contract.currentGameSolution()
        const activeGame = await this.getActiveGame(hash)

        const { state } = activeGame
        return state
    }

    currentMinesweeperSolution = async (signature) => {
        if (!this.contracts[GAMES.MINESWEEPER]) {
            throw new Error("Contract is not set")
        }

        const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.signer)

        const hash = await contract.currentGameSolution()

        const governanceAddress = await contract.governance()
        const recoveredAddress = ethers.verifyMessage("MINESWEEPER", signature)

        if (governanceAddress.toLowerCase() === recoveredAddress.toLowerCase()) {
            const activeGame = await this.getActiveGame(hash)
            const { solution } = activeGame
            return solution
        } else {
            throw new Error("The signature provided is not the governance")
        }

    }

}

exports.GameServer = GameServer