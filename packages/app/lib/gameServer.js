const { ethers } = require("ethers")
const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const { faker } = require('@faker-js/faker');

const { Database } = require("./db")
const { GAMES, ACTIVE_GAMES_TABLE } = require("./constants")

const { handleAction, initMineField, initBlankField, Cell, addFlag } = require("./helpers/minesweeper")
const blackjack = require("./helpers/blackjack")
const { random, parseCellData } = require("./helpers/utils")
const MinesweeperABI = require("./abi/Minesweeper.json")
const BlackjackABI = require("./abi/Blackjack.json")

class GameServer extends Database {

    provider
    signer

    contracts

    txs

    constructor(args) {
        super()

        this.provider = args.provider
        this.signer = args.signer
        this.contracts = args.contracts

        this.txs = []
    }

    start = () => {
        if (!this.provider) {
            throw new Error("No provider has been set")
        }

        if (this.contracts[GAMES.MINESWEEPER]) {
            const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.provider)

            contract.on("Pressed", (gameId, position, player) => {
                this.revealMinesweeperBoard(gameId, position, player)
            });

            contract.on("Flagged", (gameId, position, player) => {
                this.revealMinesweeperBoard(gameId, position, player, true)
            });
        }

        if (this.contracts[GAMES.BLACKJACK]) {
            const contract = new ethers.Contract(this.contracts[GAMES.BLACKJACK], BlackjackABI, this.provider)

            contract.on("Dealed", (account, betSize) => {
                this.createBlackjackGame(account, betSize)
            });

        }

    }

    // use poll in express
    poll = async (fromBlock = 0) => {

        if (this.contracts[GAMES.MINESWEEPER]) {
            const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.provider)

            let events = await contract.queryFilter("Pressed", fromBlock)

            for (let event of events) {
                const { transactionHash, args } = event
                if (!this.txs.includes(transactionHash)) {
                    this.revealMinesweeperBoard(args[0], args[1], args[2])
                }
                this.txs.push(transactionHash)
            }

            events = await contract.queryFilter("Flagged", fromBlock)

            for (let event of events) {
                const { transactionHash, args } = event
                if (!this.txs.includes(transactionHash)) {
                    this.revealMinesweeperBoard(args[0], args[1], args[2], true)
                }
                this.txs.push(transactionHash)
            }
        }

        if (this.contracts[GAMES.BLACKJACK]) {
            const contract = new ethers.Contract(this.contracts[GAMES.BLACKJACK], BlackjackABI, this.provider)

            const events = await contract.queryFilter("Dealed", fromBlock)

            for (let event of events) {
                const { transactionHash, args } = event
                if (!this.txs.includes(transactionHash)) {
                    this.createBlackjackGame(args[0], Number(args[1]))
                }
                this.txs.push(transactionHash)
            }

        }

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

    // MINESWEEPER

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
        const contract = new ethers.Contract(this.contracts[GAMES.MINESWEEPER], MinesweeperABI, this.provider)
        const hash = await contract.currentGameSolution()
        const activeGame = await this.getActiveGame(hash)

        const { state } = activeGame
        return state
    }

    currentMinesweeperStateByHash = async (hash) => {
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

    // BLACKJACK

    createBlackjackGame = async (account, betSize) => {

        const initState = blackjack.initialGameState(betSize)
        const updatedState = blackjack.drawAtStart(initState)

        const preImage = updatedState.deck.concat(updatedState.userCards).concat(updatedState.dealerCards)

        const tree = new MerkleTree(preImage.map(item => ethers.solidityPackedKeccak256(["string", "string"], [item.value, item.suit])), keccak256)
        const hexRoot = tree.getHexRoot();

        // settles on smart contract
        const contract = new ethers.Contract(this.contracts[GAMES.BLACKJACK], BlackjackABI, this.signer)

        await contract.initGame(account, hexRoot)

        const db = this.getDb(ACTIVE_GAMES_TABLE)

        const game = await this.getActiveGame(account)
        if (game) {
            await db.remove(game)
        }

        await db.put({
            _id: `${account}`,
            message: faker.word.words(5),
            ...updatedState
        })

    }

    currentBlackjackState = async (account) => {
        let activeGame = await this.getActiveGame(account)

        // hide hidden values
        if (activeGame.state === "userTurn") {
            activeGame.dealerCards = activeGame.dealerCards.map(item => {
                if (item.hidden === true) {
                    item.value = "*"
                    item.suit = "*"
                }
                return item
            })
            activeGame.dealerScore = blackjack.calculate(activeGame.dealerCards)
        }

        delete activeGame.deck;
        return activeGame
    }

    // 0 = hit, 1 = stand
    blackjackAction = async ({ account, signature, actionType = 0 }) => {

        const activeGame = await this.getActiveGame(account)
        const recoveredAddress = ethers.verifyMessage(activeGame.message, signature)

        if (!(account.toLowerCase() === recoveredAddress.toLowerCase())) {
            throw new Error("Invalid signature")
        }

        const updatedGame = actionType === 0 ? blackjack.hit(activeGame) : blackjack.stand(activeGame)

        const db = this.getDb(ACTIVE_GAMES_TABLE)
        // update 
        await db.put({
            _id: activeGame["_id"],
            _rev: activeGame["_rev"],
            ...updatedGame
        })

        if (["bust", "userWin", "dealerWin", "tie"].includes(updatedGame.state)) {
            // settle on contract
            const contract = new ethers.Contract(this.contracts[GAMES.BLACKJACK], BlackjackABI, this.signer)

            let resultInt

            switch (updatedGame.state) {
                case "bust":
                    resultInt = 4
                    break
                case "userWin":
                    resultInt = 5
                    break
                case "dealerWin":
                    resultInt = 6
                    break
                case "tie":
                    resultInt = 7
                    break
                default:
                    resultInt = 0
            }

            await contract.closeGame(account, resultInt)
        }

    }


}

exports.GameServer = GameServer