// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error FunMe__NotOwner();
error NotEnoughETH();
error Failed();

/** @title FundMe A contract for crowd funding
    @author linkedin: @abdellatif-anaflous
 */

contract FundMe {
    using PriceConverter for uint256;

    mapping(address => uint256) private s_addressToAmountFunded;
    address[] public s_funders;

    // Could we make this constant?  /* hint: no! We should make it immutable! */
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 50 * 10**18;
    AggregatorV3Interface private s_priceFeed;

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function fund() public payable {
        if(msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) revert NotEnoughETH();
        // require(PriceConverter.getConversionRate(msg.value) >= MINIMUM_USD, "You need to spend more ETH!");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
    }

    modifier onlyOwner(address _caller) {
        // require(_caller == owner,FunMe__NotOwner()); those two lines are equivalent
        if (_caller != i_owner) revert FunMe__NotOwner();
        _;
    }

    function withdraw() public payable onlyOwner(msg.sender) {
        payable(msg.sender).transfer(address(this).balance);
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success,)=payable(msg.sender).call{
            value: address(this).balance
        }("");
        if(!success) revert Failed();
    }

    function cheaperWithdraw() public payable onlyOwner(msg.sender){
        address[] memory funders = s_funders;
        // * mapings can't be in memory, sorry!
        for ( uint256 funderIndex = 0; funderIndex<funders.length; funderIndex++){
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders=new address[](0);
        (bool success,)=i_owner.call{value:address(this).balance}("");
        if(!success) revert Failed();
    }


    // View & Pure Functions
    function getOwner() public view returns (address){
        return i_owner;
    }
    function getFunders(uint256 index) public view returns (address){
        return s_funders[index];
    }

    function getAdressToAmountFunded(address funder) public view returns (uint256){
        return s_addressToAmountFunded[funder];
    }
    
    function getPriceFeed() public view returns (AggregatorV3Interface){
        return s_priceFeed;
    }



}

// not covered yet
// 1. Enum
// 2. Events
// 3. Try / Catch
// 4. Function Selector
// 5. abi.encode / decode
// 6. Hash with keccak256
// 7. Yul / Assembly
