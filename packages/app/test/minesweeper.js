const { ethers } = require("hardhat")
const { expect } = require("chai")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256")

const { GameServer } = require("../lib/gameServer")

const { delay } = require("./Helpers")

describe("Minesweeper", () => {

    let minesweeper
    let gameItem

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners()

        const GameItem = await ethers.getContractFactory("GameItem");
        const Minesweeper = await ethers.getContractFactory("Minesweeper");

        // init contracts
        gameItem = await GameItem.deploy()
        minesweeper = await Minesweeper.deploy(gameItem, 1)

        // init server instance
        server = new GameServer({
            provider: ethers.provider,
            signer: new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider),
            contracts: {
                "MINESWEEPER": minesweeper.address || minesweeper.target
            }
        })
        // use in-memory db
        server.useMemory()

        server.start()
    })

    // it("test", async function () {
    //     expect(true).to.equal(true)
    // })

    it("should create game and play until dead success", async function () {

        const signature = await admin.signMessage("MINESWEEPER")

        await server.requestGameCreation({
            gameId: "MINESWEEPER",
            signature,
            difficulty: 60
        })

        const currentGameId = await minesweeper.currentGameId()
        let currentGame = await minesweeper.getGameState(currentGameId)

        expect(currentGame["smileyButton"]).to.equal(0)
        expect(currentGame["minesCounter"]).to.equal(60)
        expect(currentGame["gameStarted"]).to.equal(true)
        expect(currentGame["gameEnded"]).to.equal(false)

        let state = await server.gameState("MINESWEEPER")
        let position = state.indexOf("blank")

        // open a cell until dead
        while (true) {

            await minesweeper.press(position)

            // wait until the cell has been revealed
            while (true) {
                const ongoingGameState = await minesweeper.getGameState(currentGameId)
                const ongoingPos = ongoingGameState["board"][position]

                if (Number(ongoingPos) !== 1) {
                    break
                }

                await delay(100)
            }

            state = await server.gameState("MINESWEEPER")
            position = state.indexOf("blank")

            if (position === -1) {
                break
            }

        }

        currentGame = await minesweeper.getGameState(currentGameId)
        expect(currentGame.gameEnded).to.equal(true)

    })

    it("should flag mines success and win the game", async function () {

        // create a new game that has only 3 bombs
        const signature = await admin.signMessage("MINESWEEPER")

        await server.requestGameCreation({
            gameId: "MINESWEEPER",
            signature,
            difficulty: 3
        })

        const currentGameId = await minesweeper.currentGameId()

        let state = await server.gameState("MINESWEEPER")
        // only admin can see the solution
        const solution = await server.currentMinesweeperSolution(signature)

        // find bomb pos.
        const posWithBomb = solution.reduce((arr, item, index) => {
            if (item === "x") {
                arr.push(index)
            }
            return arr
        }, [])

        console.log("posWithBomb : ", posWithBomb)

        // mint game items
        await gameItem.authorise(
            "My GameItem NFT",
            "https://api.cryptokitties.co/kitties/1",
            ethers.parseEther("0.1"),
            ethers.parseEther("0.01")
        )
        await gameItem.connect(alice).mint(
            alice.address,
            1,
            3,
            {
                value: ethers.parseEther("0.3")
            }
        )
        expect(await gameItem.balanceOf(alice.address, 1)).to.equal(3)

        // approve the contract
        await gameItem.connect(alice).setApprovalForAll( minesweeper.target, true )

        let totalFlags = 0

        for (let position of posWithBomb) {

            await minesweeper.connect(alice).flag(position)

            totalFlags += 1

            expect(totalFlags).to.equal(await minesweeper.totalFlags())

            // wait until the cell has been revealed
            while (true) {
                const ongoingGameState = await minesweeper.getGameState(currentGameId)
                const ongoingPos = ongoingGameState["board"][position]

                if (Number(ongoingPos) !== 1) {
                    break
                }

                await delay(100)
            }

            state = await server.gameState("MINESWEEPER")
            position = state.indexOf("blank")

            if (position === -1) {
                break
            }

        }

        expect(await minesweeper.totalFlags()).to.equal(0)
        expect(await gameItem.balanceOf(alice.address, 1)).to.equal(3)

        currentGame = await minesweeper.getGameState(currentGameId)
        expect(currentGame.gameEnded).to.equal(true)

    })

})