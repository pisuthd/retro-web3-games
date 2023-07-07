const { expect } = require("chai")
const wasm_tester = require("circom_tester").wasm;
const path = require("path")

const { dummyMineField, hashItems, preImage } = require("./Helpers")

describe('#circuits', () => {

    let circuit

    before(async () => {
        circuit = await wasm_tester(path.join("circuits", "msweeper.circom"))

    })

    it("should verify when game is completed", async () => {

        const solution = dummyMineField()
        const commitment = await hashItems(solution)

        const input = {
            solved: solution,
            solution,
            commitment
        }

        const witness = await circuit.calculateWitness(input);
        await circuit.assertOut(witness, { out: "1" });
    })

    it("should verify when game is not completed", async () => {

        const solution = dummyMineField()
        const commitment = await hashItems(solution)

        let solved = []

        for (let i = 0; i < 256; i++) {
            solved.push(0)
        }

        const input = {
            solved ,
            solution,
            commitment
        }

        const witness = await circuit.calculateWitness(input);
        await circuit.assertOut(witness, { out: "0" });
    })

})