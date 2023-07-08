
export const WIDTH = 16
export const HEIGHT = 16

export const Cell = {
    blank: "blank",
    pressed: 'pressed',
    bombflagged: 'bombflagged',
    bombrevealed: 'bombrevealed',
    bombmisflagged: 'bombmisflagged',
    bombdeath: 'bombdeath',
    open0: 'open0',
    open1: 'open1',
    open2: 'open2',
    open3: 'open3',
    open4: 'open4',
    open5: 'open5',
    open6: 'open6',
    open7: 'open7',
    open8: 'open8',
}


const revealBoardOnDeath = (oldBoard, mineField, deathIndex) => {
    const newBoard = [...oldBoard];
    for (let i = 0; i < oldBoard.length; ++i) {
        const cell = oldBoard[i];
        const f = mineField[i];

        if (!isBlank(cell)) {
            continue;
        } else {
            if (isBomb(f)) {
                newBoard[i] = deathIndex === i ? Cell.bombdeath : Cell.bombrevealed;
            }
            if (f === 0) newBoard[i] = Cell.open0;
            if (f === 1) newBoard[i] = Cell.open1;
            if (f === 2) newBoard[i] = Cell.open2;
            if (f === 3) newBoard[i] = Cell.open3;
            if (f === 4) newBoard[i] = Cell.open4;
            if (f === 5) newBoard[i] = Cell.open5;
            if (f === 6) newBoard[i] = Cell.open6;
            if (f === 7) newBoard[i] = Cell.open7;
            if (f === 8) newBoard[i] = Cell.open8;
        }

    }
    return newBoard;
}

export const handleAction = (state, solution, position) => {

    const cell = state[position];
    const field = solution[position];

    if (!solution || !isBlank(cell)) {
        return state;
    }

    if (isBomb(field)) {
        return revealBoardOnDeath(state, solution, position)
    }

    const newBoard = revealBoardOnClick(state, solution, position, WIDTH);
    return newBoard
}

export const initBlankField = (width, height) => {
    return Array(width * height).fill(0);
}

export const revealBoardOnClick = (board, mineField, i, w) => {
    let newBoard = [...board];
    const field = mineField[i];
    if (field === 1) { newBoard[i] = Cell.open1; return newBoard; }
    if (field === 2) { newBoard[i] = Cell.open2; return newBoard; }
    if (field === 3) { newBoard[i] = Cell.open3; return newBoard; }
    if (field === 4) { newBoard[i] = Cell.open4; return newBoard; }
    if (field === 5) { newBoard[i] = Cell.open5; return newBoard; }
    if (field === 6) { newBoard[i] = Cell.open6; return newBoard; }
    if (field === 7) { newBoard[i] = Cell.open7; return newBoard; }
    if (field === 8) { newBoard[i] = Cell.open8; return newBoard; }
    if (field === 0) {
      newBoard[i] = Cell.open0;
      const neighbourIndexes = getNeighbourIndexes(i, w, board.length).filter(ni => isBlank(board[ni]) && isNumber(mineField[ni]));
      for (let i = 0; i < neighbourIndexes.length; ++i) {
        newBoard = revealBoardOnClick(newBoard, mineField, neighbourIndexes[i], w);
      }
    }
    return newBoard;
}

const isBlank = (f) => f === 0;
const isNumber = (f) => f !== 10;
const isBomb = (f) => f === 10;

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

export const initMineField = (width, height, x, y, cnt) => {
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

    return mineField;
}

export const getIndexFromCoordinates = (x, y, w) => y * w + x;

export const getNeighbourIndexes = (i, w, size) => {
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