// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// get teh abi and BIn using "solc"
contract Test1 {
    uint256 public val;

    function setOwner(uint256 _val) public {
        val = _val;
    }
}
