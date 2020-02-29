pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FundsKeeper {
	address public owner;

	constructor() public {
		owner = msg.sender;
	}

	function withdrawTokens(address _token) public {
		require(msg.sender == owner);
		
		IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
	}
}