// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract GameItem is ERC1155, ERC1155URIStorage, ReentrancyGuard, Pausable {
    using Address for address;

    address public governance;
    uint256 public tokenIdCount;

    struct Token {
        string name;
        uint256 price;
        uint256 buyback;
        uint256 currentSupply;
        bool active;
    }

    mapping(uint256 => Token) public tokens;

    event Authorised(uint256 indexed tokenId);

    event Sold(
        uint256 tokenId,
        uint256 value,
        uint256 totalPrice,
        address toAddress
    );

    event Buyback(
        uint256 tokenId,
        uint256 value,
        uint256 totalPrice,
        address toAddress
    );

    constructor(string memory uri) ERC1155(uri) {
        governance = msg.sender;
    }

    /// @notice mint tokens
    function mint(
        address _to,
        uint256 _tokenId,
        uint256 _value
    ) external nonReentrant payable whenNotPaused {
        require( tokens[_tokenId].active == true , "Invalid token ID");

        uint256 totalPrice = tokens[_tokenId].price * _value;

        require( totalPrice == msg.value, "Invalid value");

        tokens[_tokenId].currentSupply += _value;

        _mint(_to, _tokenId, _value, "");

        emit Sold(_tokenId, _value, totalPrice, _to);
    }

    /// @notice return tokens
    function buyback(address _owner, uint256 _tokenId, uint256 _value) external nonReentrant whenNotPaused {
        require( tokens[_tokenId].active == true , "Invalid token ID");

        uint256 totalReturn = tokens[_tokenId].buyback * _value;

        (bool success, ) = _owner.call{value: totalReturn}("");
        require(success, "Failed to send Ether");

        tokens[_tokenId].currentSupply -= _value;

        _burn(_owner, _tokenId, _value);

        emit Buyback(_tokenId, _value, totalReturn, _owner);
    }

    /// @notice burn tokens
    function burn(
        address owner,
        uint256 id,
        uint256 value
    ) external nonReentrant whenNotPaused {
        tokens[id].currentSupply -= value;
        _burn(owner, id, value);
    }

    /// @notice return the token URI
    /// @param tokenId token ID
    function uri(uint256 tokenId)
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return ERC1155URIStorage.uri(tokenId);
    }

    /// @notice  check whether token ID is exist
    function tokenExist(uint256 _tokenId) external view returns (bool) {
        return ( tokens[_tokenId].active );
    }

    /// @notice check token's name for the given token ID
    function tokenName(uint256 _tokenId) external view returns (string memory) {
        return ( tokens[_tokenId].name );
    }

    /// @notice check token's current supply for the given token ID
    function tokenSupply(uint256 _tokenId) external view returns (uint256) {
        return ( tokens[_tokenId].currentSupply );
    }

    /// @notice check token's buy price for the given token ID
    function tokenPrice(uint256 _tokenId) external view returns (uint256) {
        return ( tokens[_tokenId].price );
    }

    /// @notice check token's buy price for the given token ID
    function tokenBuyback(uint256 _tokenId) external view returns (uint256) {
        return ( tokens[_tokenId].buyback );
    }

    /// @notice authorise to issue a token
    function authorise(
        string memory _name,
        string memory _tokenURI,
        uint256 _price,
        uint256 _buybackPrice
    ) external nonReentrant onlyGovernance {
        require( _price > _buybackPrice ,"Buyback price should less then price");

        tokenIdCount += 1;

        _setURI(tokenIdCount, _tokenURI);

        // set token info
        tokens[tokenIdCount].name = _name;
        tokens[tokenIdCount].price = _price;
        tokens[tokenIdCount].buyback = _buybackPrice;
        tokens[tokenIdCount].active = true;

        emit Authorised(tokenIdCount);
    }

    /// @notice only governance can update token URI
    function setURI(uint256 _tokenId, string memory _newuri) public onlyGovernance {
        _setURI(_tokenId, _newuri);
    }

    /// @notice only governance can update prices
    function setPrice(uint256 _tokenId, uint256 _price, uint256 _buybackPrice) public onlyGovernance {
        require( _price > _buybackPrice ,"Buyback price should less then price");
        tokens[_tokenId].price = _price;
        tokens[_tokenId].buyback = _buybackPrice;
    }

    /// @notice only governance can update token name
    function setName(uint256 _tokenId, string memory _name) public onlyGovernance {
        tokens[_tokenId].name = _name;
    }

    /// @notice pause the collection
    function setPaused(bool _paused) external onlyGovernance {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    /// @notice withdraw ETH
    function withdraw(address _toAddress, uint256 _amount)
        external
        nonReentrant
        onlyGovernance
    {
        (bool sent, ) = _toAddress.call{value: _amount}("");
        require(sent, "Failed to send Ether");
    }

    function updateGovernance(address _address) external onlyGovernance {
        governance = _address;
    }

    modifier onlyGovernance() {
        require(msg.sender == governance, "only governance can call this");
        _;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        
    }

}