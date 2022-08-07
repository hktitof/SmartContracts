// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
contract Charity{
     // owner state variable
    address public owner;

    // constructor
    constructor() payable{
        owner=msg.sender;
    }

    //event
    event Log(uint amount,uint gas);

    // callback function
    receive() external payable {
        emit Log(msg.value,gasleft());
    }
    modifier OnlyOwner(address _Add){
        require(msg.sender==owner,"Only owner");
        _;
    }
    function getBalance() public view returns(uint256){
        return address(this).balance;
    }
   
    function sendViaCall(address payable _to, uint256 _amount) public payable OnlyOwner(msg.sender){
        (bool success, )= _to.call{value:_amount}("");
        require(success, "call failed");
    }
}