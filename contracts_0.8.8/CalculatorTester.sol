// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
contract CalculatroTester{

    uint256 public EthPrice ;
    uint8 public decimals=8;
    int256 public price=188020801619;
    uint8 public restDecimals=18-decimals;
    uint256 public multiplicationOfRestDecimals = 10**(restDecimals);

    function setDecimals(uint8 _val) public{
        decimals=_val;
        restDecimals=18-_val;
    }

    function getEth() public {
        EthPrice= uint256(uint256(price) * 10**restDecimals);
    }
}