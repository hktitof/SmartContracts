// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
error Failed();
error Unauthorized();
error LowBalance();
error beginFailed();

contract Reverse2 {
    address private immutable owner;
    address private immutable targetContract;

    constructor(address _contractAdd) {
        owner = msg.sender;
        targetContract = _contractAdd;
    }

    receive() external payable {
        if (address(this).balance == 0) revert LowBalance();
        (bool sent, ) = address(msg.sender).call{value: address(this).balance}(
            ""
        );
        if (!sent) revert Failed();
    }

    function addFund() public payable {}

    function begin() public {
        if (owner != msg.sender) revert Unauthorized();
        (bool sent, ) = targetContract.call{value: address(this).balance}("");
        if (!sent) revert beginFailed();
    }

    function showBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
