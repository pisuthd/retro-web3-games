// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Minesweeper is ReentrancyGuard, Pausable, ERC1155Holder {
    using Address for address;

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

    // DEFAULT GAME CONFIG
    uint8 constant WIDTH = 16;
    uint8 constant HEIGHT = 16;
    uint256 constant LENGTH = 256;

    struct Game {
        SmileyButton smileyButton;
        uint8 minesCounter;
        bool gameStarted;
        bool gameEnded;
        Cell[LENGTH] board;
        bytes32 solution; // in Merkle tree root
    }

    address public governance;
    address public flagNFT;
    uint256 public flagTokenId;

    mapping(uint256 => Game) public games;
    uint256 public gameCount;

    event GameCreated(uint256 gameId, bytes32 solution);
    event Pressed(uint256 gameId, uint8 position, address account);
    event Flagged(uint256 gameId, uint8 position, address account);

    event Revealed(uint256 gameId, uint8 position, uint8 cell, uint8 smileyButton , address fromAddress);

    event Won(uint256 gameId, address winner, uint256 total);

    constructor(address _flagNFT, uint256 _flagTokenId) {
        flagNFT = _flagNFT;
        flagTokenId = _flagTokenId;

        governance = msg.sender;
    }

    function press(uint8 position) external nonReentrant whenNotPaused {
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

        games[id].board[position] = Cell.pressed;

        emit Pressed(id, position, msg.sender);
    }

    function flag(uint8 position) external nonReentrant whenNotPaused {
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

        IERC1155(flagNFT).safeTransferFrom(
            msg.sender,
            address(this),
            flagTokenId,
            1,
            "0x00"
        );

       games[id].board[position] = Cell.pressed;

        emit Flagged(id, position, msg.sender);
    }

    function totalFlags() external view returns (uint256) {
        return _totalFlags();
    }

    // get game state
    function getGameState(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }

    // get current game ID
    function currentGameId() external view returns (uint256) {
        return _currentGameId();
    }

    // get current game's hashes of solution
    function currentGameSolution() external view returns (bytes32) {
        return games[_currentGameId()].solution;
    }

    // ONLY GOVERNANCE

    // reveal a cell
    function reveal(uint256 _gameId, uint8 _position, Cell _cell, address _fromAddress) external onlyGovernance {

        if (_cell == Cell.bombdeath) {
            games[_gameId].smileyButton =  SmileyButton.facedead;
            games[_gameId].gameEnded = true;
        }

        if (_cell == Cell.bombflagged) {
            games[_gameId].minesCounter -= 1;
        }

        games[_gameId].board[_position] = _cell;

        // win if all bombs have been flagged
        if (games[_gameId].minesCounter == 0) {
            games[_gameId].gameEnded = true;
            games[_gameId].smileyButton = SmileyButton.facewin;

            uint256 totalFlags = _totalFlags();

            IERC1155(flagNFT).safeTransferFrom(
                address(this),
                _fromAddress,
                flagTokenId,
                totalFlags,
                "0x00"
             );

            emit Won(_gameId, _fromAddress, totalFlags);
        }

        emit Revealed(_gameId, _position, uint8(_cell), uint8(games[_gameId].smileyButton) ,_fromAddress);
    }

    // create new game
    function create(bytes32 _solution, uint8 _mines) external onlyGovernance {
        if (gameCount != 0) {
            require(
                games[_currentGameId()].gameEnded == true,
                "The current game is not finished"
            );
        }
        _initState(gameCount, _mines);
        _setSolution(gameCount, _solution);
        
        emit GameCreated(gameCount, _solution);

        gameCount += 1;
    }

    /// @notice only governance can update Flag NFT contract address
    function updateFlagNFT(address _flagNFT) external onlyGovernance {
        flagNFT = _flagNFT;
    }

    function updateGovernance(address _address) external onlyGovernance {
        governance = _address;
    }

    function closeGame(uint256 _gameId) external onlyGovernance {
        games[_gameId].gameEnded = true;
    }

    function overrideSolution(
        uint256 _gameId,
        bytes32 _solution
    ) external onlyGovernance {
        _setSolution(_gameId, _solution);
    }

    function overrideMines(
        uint256 _gameId,
        uint8 _value
    ) external onlyGovernance {
        games[_gameId].minesCounter = _value;
    }

    /// @notice pause the contract
    function setPaused(bool _paused) external onlyGovernance {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    // INTERNAL FUNCTIONS
    modifier onlyGovernance() {
        require(msg.sender == governance, "only governance can call this");
        _;
    }

    function _initState(uint256 _gameId, uint8 _mines) internal {
        games[_gameId].smileyButton = SmileyButton.facesmile;
        games[_gameId].minesCounter = _mines;
        games[_gameId].gameStarted = true;
    }

    function _setSolution(uint256 _gameId, bytes32 _solution) internal {
        games[_gameId].solution = _solution;
    }

    function _currentGameId() internal view returns (uint256) {
        return gameCount - 1;
    }

    function _totalFlags() internal view returns (uint256) {
        return IERC1155(flagNFT).balanceOf(
            address(this),
            flagTokenId
        );
    }
}
