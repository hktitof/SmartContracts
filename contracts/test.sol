// I'm a comment!
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

// pragma solidity ^0.8.0;
// pragma solidity >=0.8.0 <0.9.0;

contract test {
    uint256 public storedData;
    function set(uint256 x) public {
        storedData = x;
    }
}
