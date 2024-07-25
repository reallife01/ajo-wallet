// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Timelock {
    address public owner;

    mapping(address => uint256) public manualBalances;

    address public tokenAddress;

    event Deposit(address indexed _from, uint256 _amount, bool _isManual);
    event Withdrawal(address indexed _to, uint256 _amount, bool _isManual);
    event TotalBalanceUpdated(address indexed _address, uint256 _totalBalance);

    constructor(address _tokenAddress) {
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    function withdraw(uint256 _amount) external {
        require(_amount <= manualBalances[msg.sender], "Insufficient manual balance");

        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(msg.sender, _amount), "Transfer failed");

        manualBalances[msg.sender] -= _amount;

        emit Withdrawal(msg.sender, _amount, true);

        emit TotalBalanceUpdated(msg.sender, getTotalBalance(msg.sender));
    }

    function deposit(uint256 _amount) external {
        IERC20 token = IERC20(tokenAddress);

        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        manualBalances[msg.sender] += _amount;

        emit Deposit(msg.sender, _amount, false);

        emit TotalBalanceUpdated(msg.sender, getTotalBalance(msg.sender));
    }

    function getTotalBalance(address _address) public view returns (uint256) {
        return manualBalances[_address];
    }

    receive() external payable {
        revert("Contract does not accept Ether directly");
    }
}
