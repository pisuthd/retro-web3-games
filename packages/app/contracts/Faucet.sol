// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Faucet {

    enum Role {
        UNAUTHORIZED,
        ADMIN
    }

    mapping(address => Role) private permissions;

    uint256 public total;
    uint256 public amount; // amount to be giveaway

    constructor() {
        permissions[msg.sender] = Role.ADMIN;
        amount = 0.1 ether; // 0.1 OAS
    }

    function deposit() external payable {
        require(msg.value >= 0, "No value attached");
        total += msg.value;
    }

    function withdraw(address _address) external {
        require(total >= amount, "Insufficient OAS");

        (bool success, ) = _address.call{value: amount}("");
        require(success, "Failed to send Ether");

        total -= amount;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        total += msg.value;
    }

    // ADMIN FUNCTIONS

    function setAmount(uint256 _amount) external onlyAdmin() {
        require(_amount >= 0, "Invalid _amount");
        amount = _amount;
    }

    // give a specific permission to the given address
    function grant(address _address, Role _role) external onlyAdmin {
        require(_address != msg.sender, "You cannot grant yourself");
        permissions[_address] = _role;
    }

    // remove any permission binded to the given address
    function revoke(address _address) external onlyAdmin {
        require(_address != msg.sender, "You cannot revoke yourself");
        permissions[_address] = Role.UNAUTHORIZED;
    }

    // INTERNAL FUNCTIONS
    modifier onlyAdmin() {
        require(
            permissions[msg.sender] == Role.ADMIN,
            "Caller is not the admin"
        );
        _;
    }
}
