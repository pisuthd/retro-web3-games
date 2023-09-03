const express = require("express")
const cors = require("cors")
const http = require("http")
const { ethers } = require("ethers")
const cron = require("node-cron");

const { GameServer } = require("./gameServer")
const { Tomo } = require("./tomo")

const MinesweeperABI = require("./abi/Minesweeper.json")
const TomoSitterABI = require("./abi/TomoSitter.json")

require('dotenv').config()

const app = express();

app.use(express.json());
app.use(cors())

//initialize a http server
const server = http.createServer(app);

const provider = new ethers.WebSocketProvider(process.env.WEBSOCKET_URL)

const lib = new GameServer({
    provider,
    signer: new ethers.Wallet(process.env.PRIVATE_KEY, provider),
    contracts: {
        "MINESWEEPER": process.env.MINESWEEPER_ADDRESS,
        "BLACKJACK": process.env.BLACKJACK_ADDRESS
    }
})

const tomo = new Tomo({
    endpoint: process.env.TOMO_ENDPOINT,
    apiKey: process.env.TOMO_API_KEY
})

cron.schedule("*/5 * * * * *", async function () {
    const currentBlock = await provider.getBlockNumber()
    await lib.poll(currentBlock)
});

cron.schedule("*/20 * * * *", async function () {

    const contract = new ethers.Contract(process.env.TOMO_SITTER_ADDRESS, TomoSitterABI, provider)
    const tokenIds = await contract.currentLockedTokens()

    for (let tokenId of tokenIds) {
        const id = Number(tokenId)
        try {
            // add happiness point
            await tomo.addHappinessPoint(id, 30)
        } catch (e) {

        }
    }

});

app.get('/', async (req, res) => {
    return res.status(200).json({ status: "ok" });
});

app.post('/faucet', async (req, res) => {
    try {
        const { body } = req
        const { address } = body

        if (!address || !(/^0x[a-fA-F0-9]{40}$/.test(address))) {
            throw new Error(("Invalid address"))
        }

        const privateKey = process.env.PRIVATE_KEY
        const contractAddress = process.env.FAUCET_ADDRESS
        const wallet = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(contractAddress, [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_address",
                        "type": "address"
                    }
                ],
                "name": "withdraw",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ], wallet)

        await contract.withdraw(address)

        return res.status(200).json({ status: "ok", address });
    } catch (e) {
        return res.status(400).json({ status: "error", error: e.reason || e.message });
    }

})

app.post('/new', async (req, res) => {
    try {
        const { body } = req
        const { gameId, signature } = body

        await lib.requestGameCreation({
            gameId,
            signature,
            difficulty: 25
        })

        return res.status(200).json({ status: "ok", gameId });
    } catch (e) {
        return res.status(400).json({ status: "error", error: e.reason || e.message });
    }

})

// get state
app.get("/state/:hash", async (req, res) => {

    try {
        const { params } = req
        const { hash } = params

        let state

        // if not eth address
        if (!(/^0x[a-fA-F0-9]{40}$/.test(hash))) {
            state = await lib.currentMinesweeperStateByHash(hash)
        } else {
            state = await lib.currentBlackjackState(hash)
        }

        return res.status(200).json({ status: "ok", state });
    } catch (e) {
        return res.status(400).json({ status: "error", error: e.reason || e.message });
    }

})

// action
app.post("/action", async (req, res) => {

    try {
        const { body } = req
        const { account, signature, actionType } = body

        await lib.blackjackAction({
            account,
            signature,
            actionType
        })

        return res.status(200).json({ status: "ok" });
    } catch (e) {
        return res.status(400).json({ status: "error", error: e.reason || e.message });
    }

})

server.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})

exports.app = app
exports.server = server