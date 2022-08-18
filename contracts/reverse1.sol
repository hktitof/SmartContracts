// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
error Failed();
error Unauthorized();
error LowBalance();
error beginFailed();

contract reverse1 {
    receive() external payable {
        if (address(this).balance == 0) revert lowBalance();
    }
}
