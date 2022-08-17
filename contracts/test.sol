// I'm a comment!
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

// pragma solidity ^0.8.0;
// pragma solidity >=0.8.0 <0.9.0;

contract test {
    uint256 public storedData;
    uint256 public storedData2;
    
    uint256 public storedData4;
    function set(uint256 x) public {
        storedData = x;
    }
}
