const { Cell } = require("./minesweeper")

exports.isNumber = (string) => {
    console.log(string)
    const pattern = /^\d+\.?\d*$/;
    return pattern.test(string);  // returns a boolean
}

exports.slugify = (text) => {
    return text
        .toString()
        .normalize('NFD')                   // split an accented letter in the base letter and the acent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
};

exports.random = (min, max) => {
    return Math.random() * (max - min) + min;
}

exports.getIndexFromCoordinates = (x, y, w) => y * w + x;

exports.parseCellData = (input) => {
    let cellData = 0

    switch (input) {
        case Cell.pressed:
            cellData = 1
            break
        case Cell.bombflagged:
            cellData = 2
            break
        case Cell.bombrevealed:
            cellData = 3
            break
        case Cell.bombmisflagged:
            cellData = 4
            break
        case Cell.bombdeath:
            cellData = 5
            break
        case Cell.open0:
            cellData = 6
            break
        case Cell.open1:
            cellData = 7
            break
        case Cell.open2:
            cellData = 8
            break
        case Cell.open3:
            cellData = 9
            break
        case Cell.open4:
            cellData = 10
            break
        case Cell.open5:
            cellData = 11
            break
        case Cell.open6:
            cellData = 12
            break
        case Cell.open7:
            cellData = 13
            break
        case Cell.open8:
            cellData = 14
            break
        default:
            cellData = 0

    }
    return cellData
}