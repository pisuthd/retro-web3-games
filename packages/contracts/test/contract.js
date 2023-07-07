const { ethers } = require("hardhat")
const { expect } = require("chai")
const { plonk } = require("snarkjs")

const { initMineField, hashItems, initBlankField, proveToProof } = require("./Helpers")

describe("#contracts", () => {

    let contract

    before(async () => {

        [admin, alice, bob] = await ethers.getSigners();

        const Minesweeper = await ethers.getContractFactory("Minesweeper");
        const puzzleVerifier = await ethers.deployContract("Verifier");

        // init contracts
        contract = await Minesweeper.deploy(puzzleVerifier)

    })

    it("should open 3 cells with no bomb", async function () {

        // create mine field off-chain first
        const mineField = initMineField(16, 16, 3, 3, 40)
        // make the commitment
        const commitment = await hashItems(mineField)
        await contract.create(commitment)

        const currentGameId = await contract.currentGameId()
        const state = await contract.getGameState(currentGameId)

        expect(state.minesCounter).to.equal(40)
        expect(state.gameStarted).to.true
        expect(state.gameEnded).to.false
        expect(state.createdBy).to.equal(admin.address)
        expect(state.solution).to.equal(commitment)

        let solved = initBlankField(16, 16)

        const posWithNoBomb = mineField.reduce((arr, item, index) => {
            if (item !== 10) {
                arr.push(index)
            }
            return arr
        }, [])

        for (let i = 0; i < 3; i++) {

            const position = posWithNoBomb[i]

            const prove = await plonk.fullProve(
                {
                    position,
                    solved,
                    solution: mineField,
                    commitment,
                    solutionAtPosition: mineField[position]
                },
                `./circuits/puzzle.wasm`,
                `./circuits/puzzle.zkey`
            )

            await contract.reveal(position, await proveToProof(prove))

            solved[position] = mineField[position]
        }

    })

    it("should open a cell with bomb", async function () {

        // close earlier game
        await contract.closeGame(0)

        // create mine field off-chain first
        const mineField = initMineField(16, 16, 3, 3, 40)
        // make the commitment
        const commitment = await hashItems(mineField)
        await contract.create(commitment)

        const currentGameId = await contract.currentGameId()
        // ID should be increased
        expect(currentGameId).to.equal(1)

        // find bomb pos.
        const posWithBomb = mineField.reduce((arr, item, index) => {
            if (item === 10) {
                arr.push(index)
            }
            return arr
        }, [])

        const firstPosWithBomb = posWithBomb[0]

        const solved = initBlankField(16, 16)

        const prove = await plonk.fullProve(
            {
                position: firstPosWithBomb,
                solved,
                solution: mineField,
                commitment,
                solutionAtPosition: mineField[firstPosWithBomb]
            },
            `./circuits/puzzle.wasm`,
            `./circuits/puzzle.zkey`
        )

        await contract.reveal(firstPosWithBomb, await proveToProof(prove))

        // the game should be ended
        const state = await contract.getGameState(currentGameId)

        expect(state.gameStarted).to.true
        expect(state.gameEnded).to.true
        expect(state.smileyButton).to.equal(3)

    })

    it("should flag 3 cells and win the game", async function () {

        // create mine field off-chain first
        const mineField = initMineField(16, 16, 3, 3, 3)
        // make the commitment
        const commitment = await hashItems(mineField)
        await contract.create(commitment)

        const currentGameId = await contract.currentGameId()
        // ID should be increased
        expect(currentGameId).to.equal(2)

        // find bomb pos.
        const posWithBomb = mineField.reduce((arr, item, index) => {
            if (item === 10) {
                arr.push(index)
            }
            return arr
        }, [])

        // override total mines
        await contract.overrideMines(2, 3)

        let state = await contract.getGameState(currentGameId)
        expect(state.minesCounter).to.equal(3)

        const solved = initBlankField(16, 16)

        // flag first bomb by admin
        const pos1 = posWithBomb[0]

        let prove = await plonk.fullProve(
            {
                position : pos1,
                solved,
                solution: mineField,
                commitment,
                solutionAtPosition: mineField[pos1]
            },
            `./circuits/puzzle.wasm`,
            `./circuits/puzzle.zkey`
        )

        await contract.connect(admin).flag(pos1, await proveToProof(prove), {
            value : ethers.parseEther("0.1")
        })

        // flag second bomb by alice
        const pos2 = posWithBomb[1]

        prove = await plonk.fullProve(
            {
                position : pos2,
                solved,
                solution: mineField,
                commitment,
                solutionAtPosition: mineField[pos2]
            },
            `./circuits/puzzle.wasm`,
            `./circuits/puzzle.zkey`
        )

        await contract.connect(alice).flag(pos2, await proveToProof(prove), {
            value : ethers.parseEther("0.2")
        })

        // check prize pool
        let prizePool = await contract.prizePool()
        expect(ethers.formatEther(prizePool)).to.equal("0.3")
            
        // flag third bomb by charlie
        const pos3 = posWithBomb[2]
        prove = await plonk.fullProve(
            {
                position : pos3,
                solved,
                solution: mineField,
                commitment,
                solutionAtPosition: mineField[pos3]
            },
            `./circuits/puzzle.wasm`,
            `./circuits/puzzle.zkey`
        )

        await contract.connect(bob).flag(pos3, await proveToProof(prove), {
            value : ethers.parseEther("0.1")
        })

        // check prize pool again
        prizePool = await contract.prizePool()
        expect(ethers.formatEther(prizePool)).to.equal("0.1")

        // the game should be ended
        state = await contract.getGameState(currentGameId)

        expect(state.gameEnded).to.true
        expect(state.smileyButton).to.equal(2)
    })

})