pragma solidity ^0.5.0;

contract AaveLendingPoolInterface {
	
	function deposit(address _reserve, uint256 _amount, uint16 _referralCode) external payable {}
	function setUserUseReserveAsCollateral(address _reserve, bool _useAsCollateral) external {}
	function borrow(address _reserve, uint256 _amount, uint256 _interestRateMode, uint16 _referralCode) external {}
	function repay( address _reserve, uint256 _amount, address payable _onBehalfOf) external {}
}