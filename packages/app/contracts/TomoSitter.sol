// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract TomoSitter is
    ReentrancyGuard,
    IERC721Receiver,
    ERC721Holder,
    Pausable
{
    using Address for address;

    address public tomoNFT;
    address public governance;

    mapping(uint256 => address) public shared;

    uint256[] public tokens;

    event Locked(uint256 tokenId, address account);
    event Unlocked(uint256 tokenId, address account);

    constructor(address _tomoNFT) {
        tomoNFT = _tomoNFT;

        governance = msg.sender;
    }

    function lock(uint256 _tokenId) external nonReentrant whenNotPaused {
        IERC721(tomoNFT).safeTransferFrom(msg.sender, address(this), _tokenId);

        shared[_tokenId] = msg.sender;
        tokens.push(_tokenId);

        emit Locked(_tokenId, msg.sender);
    }

    function unlock(uint256 _tokenId) external nonReentrant whenNotPaused {
        require(shared[_tokenId] == msg.sender, "Caller is not an owner");

        IERC721(tomoNFT).safeTransferFrom(address(this), msg.sender, _tokenId);

        emit Unlocked(_tokenId, msg.sender);

        _remove(_indexOf(_tokenId));
        shared[_tokenId] = address(0);
    }

    function currentLockedTokens() public view returns (uint256[] memory) {
        return tokens;
    }

    // ONLY GOVERNANCE

    /// @notice pause the contract
    function setPaused(bool _paused) external onlyGovernance {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    function updateGovernance(address _address) external onlyGovernance {
        governance = _address;
    }

    // INTERNAL FUNCTIONS
    modifier onlyGovernance() {
        require(msg.sender == governance, "only governance can call this");
        _;
    }

    function _remove(uint256 _index) internal {
        require(_index < tokens.length, "index out of bound");

        for (uint256 i = _index; i < tokens.length - 1; i++) {
            tokens[i] = tokens[i + 1];
        }
        tokens.pop();
    }

    function _indexOf( uint256 searchFor) internal returns (uint256) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == searchFor) {
                return i;
            }
        }
        revert("Not Found");
    }
}
