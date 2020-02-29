pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./AaveLendingPoolInterface.sol";

contract FundsKeeper {
	address public constant DAI_ADDRESS = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
    address public constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public constant AETH_ADDRESS =  0xD483B49F2d55D2c53D32bE6efF735cB001880F79;
    address public constant AAVE_LENDING_POOL = 0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c;
    address public constant AAVE_LENDING_POOL_CORE = 0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45;
    address public constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

	address public owner;

	constructor() public {
		owner = msg.sender;
	}

	function withdrawTokens(address _token) public {
		require(msg.sender == owner);
		
		IERC20(_token).transfer(msg.sender, IERC20(_token).balanceOf(address(this)));
	}

	function borrow(uint _amount) public {
		require(msg.sender == owner);

		AaveLendingPoolInterface(AAVE_LENDING_POOL).borrow(DAI_ADDRESS, _amount, 1, 0);

		IERC20(DAI_ADDRESS).transfer(msg.sender, IERC20(DAI_ADDRESS).balanceOf(address(this)));
	}
}