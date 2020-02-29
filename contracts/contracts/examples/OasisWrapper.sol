pragma solidity ^0.5.0;

import "./DSMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract TokenInterface {
    function allowance(address, address) public returns (uint256);

    function balanceOf(address) public returns (uint256);

    function approve(address, uint256) public;

    function transfer(address, uint256) public returns (bool);

    function transferFrom(address, address, uint256) public returns (bool);

    function deposit() public payable;

    function withdraw(uint256) public;
}


contract Eth2DaiInterface {
    function getBuyAmount(IERC20 tokenToBuy, IERC20 tokenToPay, uint256 amountToPay)
        external
        view
        returns (uint256 amountBought);

    function getPayAmount(IERC20 tokenToPay, IERC20 tokenToBuy, uint256 amountToBuy)
        public
        view
        returns (uint256 amountPaid);

    function sellAllAmount(IERC20 pay_gem, uint256 pay_amt, IERC20 buy_gem, uint256 min_fill_amount)
        public
        returns (uint256 fill_amt);

    function buyAllAmount(IERC20 buy_gem, uint256 buy_amt, IERC20 pay_gem, uint256 max_fill_amount)
        public
        returns (uint256 fill_amt);
}



contract OasisWrapper is DSMath {
    address public constant OTC_ADDRESS = 0x4A6bC4e803c62081ffEbCc8d227B5a87a58f1F8F;
    address public constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

    function swapTokenToEther(address _tokenAddress, uint _amount) external returns(uint) {
        require(IERC20(_tokenAddress).approve(OTC_ADDRESS, _amount));

        uint ethBought = Eth2DaiInterface(OTC_ADDRESS).sellAllAmount(IERC20(_tokenAddress), _amount,
         IERC20(WETH_ADDRESS), 0);

        TokenInterface(WETH_ADDRESS).withdraw(ethBought);

        msg.sender.transfer(ethBought);

        return ethBought;
    }

    function getSellAmount(address _src, address _dest, uint _buyQty) public view returns (uint) {
        return Eth2DaiInterface(OTC_ADDRESS).getPayAmount(IERC20(_src), IERC20(_dest), _buyQty);
    }

    function() payable external {}
}
