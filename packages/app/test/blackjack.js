const { ethers } = require("hardhat")
const { expect } = require("chai")
const { MerkleTree } = require('merkletreejs')
const keccak256 = require("keccak256")

const { GameServer } = require("../lib/gameServer")

const { delay } = require("./Helpers")

describe("Blackjack", () => {

    let blackjack
    let gameItem

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners()

        const GameItem = await ethers.getContractFactory("GameItem")
        const Blackjack = await ethers.getContractFactory("Blackjack")

        // init contracts
        gameItem = await GameItem.deploy()
        blackjack = await Blackjack.deploy(gameItem, 1)

        // init server instance
        server = new GameServer({
            provider: ethers.provider,
            signer: new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider),
            contracts: {
                "BLACKJACK": blackjack.address || blackjack.target
            }
        })

        // use in-memory db
        server.useMemory()

        server.start()
    })


    it("should create game and use stand success", async function () {
        // mint game items
        await gameItem.authorise(
            "My GameItem NFT",
            "https://api.cryptokitties.co/kitties/1",
            ethers.parseEther("0.01"),
            ethers.parseEther("0.001")
        )
        // mint for Alice first
        await gameItem.connect(alice).mint(
            alice.address,
            1,
            100,
            {
                value: ethers.parseEther("1")
            }
        )
        expect(await gameItem.balanceOf(alice.address, 1)).to.equal(100)
        // then mint for Admin and deposit them to the contract
        await gameItem.connect(admin).mint(
            admin.address,
            1,
            100,
            {
                value: ethers.parseEther("1")
            }
        )
        expect(await gameItem.balanceOf(admin.address, 1)).to.equal(100)
        // approve the contract
        await gameItem.connect(alice).setApprovalForAll(blackjack.target, true)
        await gameItem.connect(admin).setApprovalForAll(blackjack.target, true)

        // deposit 100 items for being a broker
        await blackjack.connect(admin).deposit(100)

        // make a deal with 10 items
        await blackjack.connect(alice).deal(10)

        // wait until the game has been started
        while (true) {
            const game = await blackjack.games(alice.address)
            const state = game["state"]

            await delay(100)
            if (Number(state) !== 0) {
                break
            }
        }

        // verify init state
        const state = await server.currentBlackjackState(alice.address)

        expect(state.state).to.equal("userTurn")
        expect(state.userCards.length).to.equal(2)
        expect(state.dealerCards.length).to.equal(2)
        expect(state.bet).to.equal(10)

        // play now
        const signature = await alice.signMessage(state.message)
        await server.blackjackAction({
            account: alice.address,
            signature,
            actionType: 1 // stand
        })

        const updatedState = await server.currentBlackjackState(alice.address)
        expect(["userWin", "dealerWin", "tie"].includes(updatedState.state)).to.true

        // wait until the game ended
        while (true) {
            const game = await blackjack.games(alice.address)
            const ended = game["gameEnded"]
            await delay(100)
            if (ended === true) {
                break
            }
        }

    })


    it("should create game again and use hit success", async function () {

        // make a deal with 10 items
        await blackjack.connect(alice).deal(10)

        // wait until the game has been started
        while (true) {
            const game = await blackjack.games(alice.address)
            const state = game["state"]

            await delay(100)
            if (Number(state) !== 0) {
                break
            }
        }

        const state = await server.currentBlackjackState(alice.address)

        // play until win or lose the game
        while (true) {
            const signature = await alice.signMessage(state.message)
            await server.blackjackAction({
                account: alice.address,
                signature,
                actionType: 0 // hit
            })

            const updatedState = await server.currentBlackjackState(alice.address)

            if (updatedState["state"] !== "userTurn") {
                break
            }
        }
        while (true) {
            const game = await blackjack.games(alice.address)
            const ended = game["gameEnded"]
            await delay(100)
            if (ended === true) {
                break
            }
        }
    })


})

