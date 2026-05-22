// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CourseReward {
    // State variables
    address public owner;
    uint256 public rewardAmount;
    uint256 public deadline;
    mapping(address => bool) public hasClaimed;
    mapping(address => bool) public whitelist;

    // Events
    event RewardClaimed(address indexed student, uint256 amount);
    event RewardAmountChanged(uint256 oldAmount, uint256 newAmount);
    event StudentWhitelisted(address indexed student);

    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    // Constructor - deploy with ETH to fund rewards
    constructor(uint256 _rewardAmount, uint256 _deadline) payable {
        owner = msg.sender;
        rewardAmount = _rewardAmount;
        deadline = _deadline;
    }

    // Owner: update reward amount
    function setRewardAmount(uint256 _newAmount) external onlyOwner {
        uint256 old = rewardAmount;
        rewardAmount = _newAmount;
        emit RewardAmountChanged(old, _newAmount);
    }

    // Owner: whitelist a student
    function addToWhitelist(address _student) external onlyOwner {
        whitelist[_student] = true;
        emit StudentWhitelisted(_student);
    }

    // Student: claim reward (once only)
    function claim() external {
        require(whitelist[msg.sender], "Not whitelisted");
        require(!hasClaimed[msg.sender], "Already claimed");
        require(block.timestamp <= deadline, "Deadline passed");
        require(address(this).balance >= rewardAmount, "Insufficient balance");

        hasClaimed[msg.sender] = true;

        (bool success, ) = payable(msg.sender).call{value: rewardAmount}("");
        require(success, "Transfer failed");

        emit RewardClaimed(msg.sender, rewardAmount);
    }

    // Owner: withdraw remaining funds
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    // View: check contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Accept ETH top-ups
    receive() external payable {}
}
