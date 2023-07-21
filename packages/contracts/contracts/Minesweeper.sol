// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Verifier.sol";

contract Minesweeper {

    enum SmileyButton {
        facesmile,
        facepressed,
        facewin,
        facedead,
        faceooh
    }

    enum Cell {
        blank,
        pressed,
        bombflagged,
        bombrevealed,
        bombmisflagged,
        bombdeath,
        open0,
        open1,
        open2,
        open3,
        open4,
        open5,
        open6,
        open7,
        open8
    }

    enum Role {
        UNAUTHORIZED,
        ADMIN
    }

    // DEFAULT GAME CONFIG
    uint8 constant MINES = 10;
    uint8 constant WIDTH = 16;
    uint8 constant HEIGHT = 16;
    uint256 constant LENGTH = 256;

    struct Game {
        SmileyButton smileyButton;
        uint8 minesCounter;
        bool gameStarted;
        bool gameEnded;
        address createdBy;
        Cell[LENGTH] board;
        uint256 solution; // in Poseidon's hash
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCount;
    uint256 public minStakeAmount;

    uint256 private seed; // FIXME: should rotates on every transactions

    Verifier public verifier;

    uint256 public prizePool;

    // ACL
    mapping(address => Role) private permissions;

    event Won(uint256 gameId, address account, uint256 prize);

    constructor(address _verifier) {
        permissions[msg.sender] = Role.ADMIN;
        minStakeAmount = 0.1 ether;

        verifier = Verifier(_verifier);

        // default seed
        seed = 1234;
    }

    // create new game
    function create(uint256 _solution) external {
        if (gameCount != 0) {
            require(
                games[_currentGameId()].gameEnded == true,
                "The current game is not finished"
            );
        }

        _initState(gameCount);
        _setSolution(gameCount, _solution);

        gameCount += 1;
    }

    // get current game ID
    function currentGameId() external view returns (uint256) {
        return _currentGameId();
    }

    // get game state
    function getGameState(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }

    // reveal cell
    function reveal(uint8 position, uint256[24] calldata proof, uint256[1] calldata publicSignals) external {
        uint256 id = _currentGameId();

        require(
            games[id].gameStarted == true,
            "The current game is not started"
        );
        require(
            games[id].gameEnded == false,
            "The current game is already ended"
        );
        require(
            games[id].board[position] == Cell.blank,
            "The cell is not blank"
        );

        require(
            (verifier).verifyProof(proof, publicSignals),
            "SNARK verification failed"
        );

        uint256 val = uint256(position)+seed;

        // no bomb
        if (val == publicSignals[0]) {
            games[id].board[position] = Cell.pressed;
        }

        // has a bomb
        if (val+1 == publicSignals[0]) {
            games[id].smileyButton = SmileyButton.facedead;
            games[id].board[position] = Cell.bombdeath;
            games[id].gameEnded = true;
        }

    }

    // flag cell and must stake at min. stake amount
    function flag(uint8 position, uint256[24] calldata proof, uint256[1] calldata publicSignals) payable external {
        require(msg.value >= minStakeAmount, "Not exceed minStakeAmount");

        uint256 id = _currentGameId();

        require(
            games[id].gameStarted == true,
            "The current game is not started"
        );
        require(
            games[id].gameEnded == false,
            "The current game is already ended"
        );
        require(
            games[id].board[position] == Cell.blank,
            "The cell is not blank"
        );

        require(
            (verifier).verifyProof(proof, publicSignals),
            "SNARK verification failed"
        );

        uint256 val = uint256(position)+seed;

        // no bomb
        if (val == publicSignals[0] ) {
            games[id].board[position] = Cell.pressed;
        }

        // has a bomb
        if (val+1 == publicSignals[0]) {
            games[id].board[position] = Cell.bombflagged;
            games[id].minesCounter -= 1;
        }

        // win if all bombs have been flagged
        if (games[id].minesCounter == 0) {
            games[id].gameEnded = true;
            games[id].smileyButton = SmileyButton.facewin;

            (bool success, ) = msg.sender.call{value: prizePool}("");
            require(success, "Failed to send Ether");

            emit Won(id, msg.sender, prizePool);
            
            prizePool = 0;
        }

        prizePool += msg.value;
    }

    // ADMIN FUNCTIONS

    function updateSeed(uint256 _seed) external onlyAdmin {
        seed = _seed;
    }

    function updateMinStakeAmount(uint256 _amount) external onlyAdmin {
        minStakeAmount = _amount;
    }

    function updateGameId(uint256 _gameId) external onlyAdmin {
        gameCount = _gameId;
    }

    function overrideSolution(uint256 _gameId, uint256 _solution) external onlyAdmin {
        _setSolution(_gameId, _solution);
    }

    function overrideMines(uint256 _gameId, uint8 _value) external onlyAdmin {
        games[_gameId].minesCounter = _value;
    }

    function closeGame(uint256 _gameId) external onlyAdmin {
        games[_gameId].gameEnded = true;
    }

    // INTERNAL FUNCTIONS
    modifier onlyAdmin() {
        require(
            permissions[msg.sender] == Role.ADMIN,
            "Caller is not the admin"
        );
        _;
    }

    // init state
    function _initState(uint256 _gameId) internal {
        games[_gameId].smileyButton = SmileyButton.facesmile;
        games[_gameId].minesCounter = MINES;
        games[_gameId].createdBy = msg.sender;
        games[_gameId].gameStarted = true;
    }

    function _setSolution(uint256 _gameId, uint256 _solution) internal {
        games[_gameId].solution = _solution;
    }

    function _currentGameId() internal view returns (uint256) {
        return gameCount - 1;
    }

    // function _getIndexFromCoordinates(
    //     uint8 x,
    //     uint8 y,
    //     uint8 w
    // ) internal pure returns (uint8) {
    //     return (y * w) + x;
    // }
}
