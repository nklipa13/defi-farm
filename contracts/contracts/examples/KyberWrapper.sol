pragma solidity ^0.5.0;

import "./DSMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KyberNetworkProxyInterface.sol";

contract KyberWrapper is DSMath {
    address public constant OTC_ADDRESS = 0x4A6bC4e803c62081ffEbCc8d227B5a87a58f1F8F;
    address public constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    address public constant KYBER_INTERFACE = 0x692f391bCc85cefCe8C237C01e1f636BbD70EA4D;
    address public constant KYBER_ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;


    function swapTokenToEther(address _tokenAddress, uint _amount) external returns(uint) {
        uint minRate;
        IERC20 ETH_TOKEN_ADDRESS = IERC20(KYBER_ETH_ADDRESS);
        IERC20 token = IERC20(_tokenAddress);

        KyberNetworkProxyInterface _kyberNetworkProxy = KyberNetworkProxyInterface(KYBER_INTERFACE);

        (, minRate) = _kyberNetworkProxy.getExpectedRate(token, ETH_TOKEN_ADDRESS, _amount);

        // Mitigate ERC20 Approve front-running attack, by initially setting, allowance to 0
        require(token.approve(address(_kyberNetworkProxy), 0));

        // Approve tokens so network can take them during the swap
        token.approve(address(_kyberNetworkProxy), _amount);

        uint destAmount = _kyberNetworkProxy.trade(
            token,
            _amount,
            ETH_TOKEN_ADDRESS,
            msg.sender,
            uint(-1),
            minRate,
            OTC_ADDRESS
        );

        return destAmount;
    }

    function getSellAmount(address _src, address _dest, uint _buyQty) public view returns (uint) {
    	uint rate;
    	// get rate for selling 100 DAI
        (rate, ) = KyberNetworkProxyInterface(KYBER_INTERFACE).getExpectedRate(IERC20(_src), IERC20(_dest), 100000000000000000000);

        return wdiv(_buyQty, rate);
    }

    function() payable external {}
}
