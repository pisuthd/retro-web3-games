const { expect } = require("chai")
const wasm_tester = require("circom_tester").wasm;
const path = require("path")

const { dummyMineField, hashItems, preImage, initBlankField } = require("./Helpers")

describe('#circuits', () => {

    let circuit

    before(async () => {
        circuit = await wasm_tester(path.join("circuits", "puzzle.circom"))
    })

    it("should reveal all cells /w no bomb success", async () => {
        const solution = dummyMineField()
        const commitment = await hashItems(solution)
    
        let solved = initBlankField(16,16)

        // find pos. with no bomb
        const posWithNoBomb = solution.reduce((arr, item, index) => {
            if (item !== 10) {
                arr.push(index)
            }
            return arr
        }, [])

        for (let pos of posWithNoBomb) {

            const input = {
                position: pos,
                solved,
                solution,
                commitment,
                solutionAtPosition : solution[pos]
            }

            const witness = await circuit.calculateWitness(input)
            await circuit.assertOut(witness, { out: "0" })
        }
    })

    it("should reveal cells /w bomb success", async () => {
        const solution = dummyMineField()
        const commitment = await hashItems(solution)
    
        let solved = initBlankField(16,16)

        // find pos. with bombs
        const posWithBomb = solution.reduce((arr, item, index) => {
            if (item === 10) {
                arr.push(index)
            }
            return arr
        }, [])
        
        for (let pos of posWithBomb) {

            const input = {
                position: pos,
                solved,
                solution,
                commitment,
                solutionAtPosition : solution[pos]
            }

            const witness = await circuit.calculateWitness(input)
            await circuit.assertOut(witness, { out: "1" })
        }

    })

})