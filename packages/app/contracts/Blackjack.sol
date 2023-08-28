// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract Blackjack is ReentrancyGuard, Pausable, ERC1155Holder {
    using Address for address;

    enum Result {
        init,
        bet,
        userTurn,
        dealerTurn,
        bust,
        userWin,
        dealerWin,
        tie
    }

    struct Game {
        bool gameStarted;
        bool gameEnded;
        uint256 betSize;
        Result result;
        bytes32 state; // in Merkle tree root
    }

    address public governance;
    address public flagNFT;
    uint256 public flagTokenId;

    uint256 public pool;

    mapping(address => Game) public games;

    event Dealed(address account, uint256 betSize);
    event GameCreated(address account, bytes32 root);
    event GameClosed(address account, uint8 result);

    constructor(address _flagNFT, uint256 _flagTokenId) {
        flagNFT = _flagNFT;
        flagTokenId = _flagTokenId;

        governance = msg.sender;
    }

    function deal(uint256 _betSize) external nonReentrant whenNotPaused {
        require(_betSize > 0 && pool >= _betSize, "Invalid bet size");
        require(
            games[msg.sender].gameStarted == false,
            "The game is already started"
        );

        games[msg.sender].betSize = _betSize;
        games[msg.sender].gameStarted = true;
        games[msg.sender].gameEnded = false;
        games[msg.sender].result = Result.init;

        IERC1155(flagNFT).safeTransferFrom(
            msg.sender,
            address(this),
            flagTokenId,
            _betSize,
            "0x00"
        );

        pool += _betSize;

        emit Dealed(msg.sender, _betSize);
    }

    function deposit(uint256 _value) external nonReentrant whenNotPaused {
        require(_value > 0, "Invalid value");

        IERC1155(flagNFT).safeTransferFrom(
            msg.sender,
            address(this),
            flagTokenId,
            _value,
            "0x00"
        );

        pool += _value;
    }

    // ONLY GOVERNANCE

    function withdraw(uint256 _value) external onlyGovernance {
        require(pool >= _value, "Insufficient value");

        IERC1155(flagNFT).safeTransferFrom(
            address(this),
            msg.sender,
            flagTokenId,
            _value,
            "0x00"
        );

        pool -= _value;
    }

    function initGame(address _address, bytes32 _root) external onlyGovernance {
        games[_address].state = _root;
        games[_address].result = Result.userTurn;
        emit GameCreated(_address, _root);
    }

    function closeGame(
        address _address,
        Result _result
    ) external onlyGovernance {
        games[_address].gameStarted = false;
        games[_address].gameEnded = true;
        games[_address].result = _result;
        games[_address].state = bytes32(0);

        if (_result == Result.userWin) {
            uint256 reward = games[_address].betSize * 2;
            IERC1155(flagNFT).safeTransferFrom(
                address(this),
                _address,
                flagTokenId,
                reward,
                "0x00"
            );
            pool -= reward;
        }

        if (_result == Result.tie) {
            IERC1155(flagNFT).safeTransferFrom(
                address(this),
                _address,
                flagTokenId,
                games[_address].betSize,
                "0x00"
            );
            pool -= games[_address].betSize;
        }

        emit GameClosed(_address, uint8(_result));
    }

    function cancel(address _address) external onlyGovernance {
        games[_address].gameStarted = false;
        games[_address].gameEnded = false;
        games[_address].betSize = 0;
        games[_address].state = bytes32(0);
    }

    /// @notice only governance can update Flag NFT contract address
    function updateFlagNFT(address _flagNFT) external onlyGovernance {
        flagNFT = _flagNFT;
    }

    function updateGovernance(address _address) external onlyGovernance {
        governance = _address;
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
}
