// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./Token.sol";
import "./ExistingToken.sol";
import "./Ownable.sol";

contract TokenSwap is Ownable {
    string public name = "TokenSwap";
    Token public newToken;
    ExistingToken public oldToken;
    uint8 public rate = 2; // Assumption 2 new token = 1 old tokens
    uint public buyRate = 1000; // Assumption 1ether = 1000 old tokens

    // Struct to store swap details
    struct SwapDetails {
        address from;
        address tokenA;
        address tokenB;
        uint amount;
    }
    // Struct to store buy details
    struct BuyDetails {
        address from;
        address token;
        uint amount;
    }
    SwapDetails[] public swapDetails;
    BuyDetails[] public buyDetails;

    event Swap(address indexed _from,address tokenA, address tokenB, uint _amount);
    event Buy(address indexed _from, address token, uint _amount);

    constructor(Token _newToken, ExistingToken _oldToken) Ownable(msg.sender) {
        newToken = _newToken;
        oldToken = _oldToken;
    }

    // Change rate of new token to old token and cost of tokens
    function changeRate(uint8 _rate, uint _buyRate) external  onlyOwner{
        rate = _rate;
        buyRate = _buyRate;
    }

    // Transfer all tokens owned by the user to the contract as liquidity
    function transferAllTokensToContract(address _token) public {
        uint userBalance;
        if (_token == address(newToken)) {
            userBalance = newToken.balanceOf(msg.sender);
            require(userBalance > 0, "No new tokens to transfer");
            newToken.transferFrom(msg.sender, address(this), userBalance);
        } else if (_token == address(oldToken)) {
            userBalance = oldToken.balanceOf(msg.sender);
            require(userBalance > 0, "No old tokens to transfer");
            oldToken.transferFrom(msg.sender, address(this), userBalance);
        } else {
            revert("Invalid token address");
        }
    }

    // Buy tokens
    function buyTokens(address _token, uint _amount) public payable returns (bool) {
        uint totalAmount = _amount * buyRate;
        if(_token == address(newToken)){
            require(newToken.balanceOf(address(this)) >= totalAmount*2);
            newToken.transfer(msg.sender, totalAmount*2);
            buyDetails.push(BuyDetails(msg.sender, address(newToken), _amount));
            emit Buy(msg.sender, address(newToken), _amount);
            return true;
        } else if(_token == address(oldToken)){
            require(oldToken.balanceOf(address(this)) >= totalAmount);
            oldToken.transfer(msg.sender, totalAmount);
            buyDetails.push(BuyDetails(msg.sender, address(oldToken), _amount));
            emit Buy(msg.sender, address(oldToken), _amount);
            return true;
        }
        return false;
    }


    // Swap old token for new token
    function OldToNew(uint _amount) public payable returns (bool) {
        require(oldToken.balanceOf(msg.sender) >= _amount);
        require(newToken.balanceOf(address(this)) >= _amount * rate);
        oldToken.transferFrom(msg.sender, address(this), _amount);
        newToken.transfer(msg.sender, _amount * rate);
        swapDetails.push(SwapDetails(msg.sender, address(oldToken), address(newToken), _amount));
        emit Swap(msg.sender, address(oldToken), address(newToken), _amount);
        return true;
    }

    // Swap new token for old token
    function NewToOld(uint _amount) public payable returns (bool) {
        require(newToken.balanceOf(msg.sender) >= _amount);
        require(oldToken.balanceOf(address(this)) >= _amount / rate);
        newToken.transferFrom(msg.sender, address(this), _amount);
        oldToken.transfer(msg.sender, _amount / rate);
        swapDetails.push(SwapDetails(msg.sender, address(newToken), address(oldToken), _amount));
        emit Swap(msg.sender, address(newToken), address(oldToken), _amount);
        return true;
    }

    function getSwapTransferDetails(address _address) public view returns (SwapDetails[] memory) {
        SwapDetails[] memory result = new SwapDetails[](swapDetails.length);
        uint counter = 0;
        for (uint i = 0; i < swapDetails.length; i++) {
            if (swapDetails[i].from == _address) {
                result[counter] = swapDetails[i];
                counter++;
            }
        }
        return result;
    }

    function getBuyTransferDetails(address _address) public view returns (BuyDetails[] memory) {
        BuyDetails[] memory result = new BuyDetails[](buyDetails.length);
        uint counter = 0;
        for (uint i = 0; i < buyDetails.length; i++) {
            if (buyDetails[i].from == _address) {
                result[counter] = buyDetails[i];
                counter++;
            }
        }
        return result;
    }
}