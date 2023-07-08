const { buildPoseidon } = require("circomlibjs")
const bigintConversion = require('bigint-conversion')
const { plonk } = require("snarkjs")

const shuffleArray = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

const getIndexFromCoordinates = (x, y, w) => y * w + x;

const getNeighbourIndexes = (i, w, size) => {
    const neighbourIndexes = [];
    const isFirstColumn = i % w === 0;
    const isLastColumn = i % w === w - 1;
    const isFirstRow = i < w;
    const isLastRow = i + w >= size;
    if (!isFirstColumn) neighbourIndexes.push(i - 1);
    if (!isLastColumn) neighbourIndexes.push(i + 1);
    if (!isFirstRow) {
        neighbourIndexes.push(i - w);
        if (!isFirstColumn) neighbourIndexes.push(i - w - 1);
        if (!isLastColumn) neighbourIndexes.push(i - w + 1);
    }
    if (!isLastRow) {
        neighbourIndexes.push(i + w);
        if (!isFirstColumn) neighbourIndexes.push(i + w - 1);
        if (!isLastColumn) neighbourIndexes.push(i + w + 1);
    }
    return neighbourIndexes;
}

exports.initMineField = (width, height, x, y, cnt) => {
    const mineFieldSize = width * height
    let mineField = Array(mineFieldSize);

    mineField[getIndexFromCoordinates(x, y, width)] = 'X';
    var minesArr = new Array(mineFieldSize - 1);
    for (let i = 0; i < cnt; i++) {
        minesArr[i] = 'x';
    }
    minesArr = shuffleArray(minesArr);

    for (let i = 0, m = 0; i < mineFieldSize; i++) {
        if (mineField[i] !== 'X') {
            mineField[i] = minesArr[m++];
        }
    }

    for (let i = 0; i < mineFieldSize; ++i) {
        if (mineField[i] !== 'x') {
            const neighbourIndexes = getNeighbourIndexes(i, width, mineFieldSize);
            const neighbourMines = neighbourIndexes.map(ni => mineField[ni] === 'x' ? 1 : 0);
            const neighbourMinesCount = neighbourMines.reduce((acc, cur) => (acc + cur), 0);
            mineField[i] = `${neighbourMinesCount}`;
        }
    }

    return mineField.map((item) => {
        if (item === "x") {
            return 10
        } else {
            return Number(item)
        }
    });
}

exports.initBlankField = (width, height) => {
    return Array(width * height).fill(0);
}

exports.hashItems = async (items) => {
    const poseidon = await buildPoseidon()
    let hashed = []
    for (let item of items) {
        hashed.push(await this.encode(item))
    }
    const preImage = hashed.reduce((sum, x) => sum + x, 0n);
    return poseidon.F.toObject(poseidon([preImage]))
}

exports.dummyMineField = () => {
    const seed = ["0", "0", "1", "2", "3", "2", "2", "x", "1", "0", "1", "x", "x", "2", "2", "x", "0", "0", "2", "x", "x", "x", "2", "1", "2", "2", "3", "3", "2", "2", "x", "2", "1", "1", "2", "x", "x", "3", "1", "0", "1", "x", "x", "1", "0", "1", "2", "2", "x", "1", "1", "2", "2", "1", "0", "1", "2", "3", "2", "1", "0", "0", "1", "x", "2", "2", "1", "0", "0", "0", "0", "1", "x", "1", "0", "0", "1", "2", "3", "2", "2", "x", "2", "1", "1", "1", "0", "1", "1", "1", "0", "1", "3", "x", "x", "2", "2", "x", "2", "1", "x", "1", "0", "0", "0", "0", "1", "2", "x", "x", "4", "x", "2", "2", "1", "1", "1", "1", "0", "0", "0", "1", "2", "x", "3", "3", "3", "2", "x", "1", "0", "0", "1", "2", "2", "1", "0", "1", "x", "2", "2", "2", "x", "1", "1", "1", "0", "0", "1", "x", "x", "2", "1", "2", "1", "1", "1", "x", "2", "1", "1", "1", "1", "1", "2", "2", "2", "2", "x", "1", "0", "0", "1", "1", "1", "0", "x", "2", "2", "x", "1", "1", "1", "2", "1", "1", "0", "0", "0", "0", "1", "1", "1", "2", "x", "2", "1", "1", "x", "1", "0", "0", "0", "1", "1", "1", "1", "x", "0", "1", "2", "2", "1", "1", "1", "1", "0", "0", "0", "2", "x", "2", "1", "1", "0", "0", "2", "x", "2", "0", "0", "0", "0", "0", "0", "2", "x", "2", "0", "0", "0", "0", "2", "x", "2", "0", "0", "0", "0", "0", "0", "1", "1", "1", "0", "0"]
    let result = []
    for (let item of seed) {
        if (item === "x") {
            result.push(10)
        } else {
            result.push(Number(item))
        }
    }
    return result
}

exports.encode = (val) => {
    switch (typeof val) {
        case "number":
            return BigInt(val);
        case "string":
            return bigintConversion.textToBigint(val);
        case "object":
            return bigintConversion.bufToBigint(val.buffer);
        default:
            return 0n;
    }
}

exports.preImage = (items) => {
    let output = 0
    for (let item of items) {
        output += Number(item)
    }
    return output
}

exports.proveToProof = async (prove) => {
    const calldata = await plonk.exportSolidityCallData(prove.proof, prove.publicSignals)
    const proof = JSON.parse(calldata.substring(0, calldata.indexOf("]") + 1))
    return proof
}

exports.getIndexFromCoordinates = (x, y, w) => y * w + x;