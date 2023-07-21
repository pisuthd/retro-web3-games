const { ethers } = require("hardhat")
const { expect } = require("chai")
const { plonk } = require("snarkjs")

const { ServerLib } = require("lib")

const { getIndexFromCoordinates } = require("./Helpers")


describe("#msweeper", () => {

    let contract
    let server

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners()

        const Minesweeper = await ethers.getContractFactory("Minesweeper");
        const puzzleVerifier = await ethers.deployContract("Verifier")

        // init contracts
        contract = await Minesweeper.deploy(puzzleVerifier)

        // init server instance
        server = new ServerLib({
            provider: ethers.provider
        })
        // use in-memory db
        server.useMemory()
    })

    it("should create game and play until dead success", async function () {

        const commitment = await server.requestGameCreation(60)
        const initState = await server.state(commitment)

        const sum = initState.reduce((result, item) => {
            return item
        }, undefined)

        expect(sum).to.equal("blank")

        // create new game
        await contract.create(commitment)
        const currentGameId = await contract.currentGameId()
        await contract.overrideMines(currentGameId, 60);

        let position = initState.indexOf("blank")

        // open a cell until dead
        while (true) {
            const proof = await server.generateProof(commitment, position)

            // on-chain first
            const tx  = await contract.reveal(position, proof.proof, proof.publicSignals)
            // then update state off-chain
            await server.updateState(commitment, tx.hash)
            const state = await server.state(commitment)

            position = state.indexOf("blank")

            if (position === -1) {
                break
            }

        }

        const state = await contract.getGameState(currentGameId)

        expect(state.gameEnded).to.equal(true)

    })

})