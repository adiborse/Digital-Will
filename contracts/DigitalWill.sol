// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

/**
 * @title DigitalWill
 * @dev A simple digital will contract where the owner stores private will data
 * and only the nominee can read it after the chosen release time.
 */
contract DigitalWill {
    address public owner;
    address public nominee;
    string private willData;
    uint256 public releaseTime;

    event WillCreated(address indexed owner, address indexed nominee, uint256 releaseTime);
    event WillUpdated(address indexed owner, uint256 updatedAt);
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyNominee() {
        require(msg.sender == nominee, "Only the nominee can access the will");
        _;
    }

    /**
     * @dev Sets the contract owner, nominee, and release time when deployed.
     * @param _nominee Wallet address of the nominee.
     * @param _releaseTime Unix timestamp after which the nominee can read the will.
     */
    constructor(address _nominee, uint256 _releaseTime) {
        require(_nominee != address(0), "Nominee address cannot be zero");
        require(_releaseTime >= block.timestamp, "Release time cannot be in the past");

        owner = msg.sender;
        nominee = _nominee;
        releaseTime = _releaseTime;

        emit WillCreated(owner, nominee, releaseTime);
    }

    /**
     * @dev Stores or updates the will text.
     * Only the owner is allowed to call this function.
     * @param data The will content to store on the blockchain.
     */
    function setWill(string memory data) external onlyOwner {
        require(bytes(data).length > 0, "Will data cannot be empty");

        willData = data;

        emit WillUpdated(msg.sender, block.timestamp);
    }

    /**
     * @dev Returns the will text.
     * Only the nominee can call it and only after the release time is reached.
     */
    function getWill() external view onlyNominee returns (string memory) {
        require(bytes(willData).length > 0, "Will data has not been set yet");
        require(block.timestamp >= releaseTime, "Will cannot be accessed before release time");

        return willData;
    }
}
