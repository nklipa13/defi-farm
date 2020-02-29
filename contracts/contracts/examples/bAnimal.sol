pragma solidity ^0.5.0;

import "../DefiNFTInterface.sol";
import "./AaveLendingPoolInterface.sol";
import "./aTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FundsKeeper.sol";
import "./OasisWrapper.sol";
import "./FlashLoanReceiverBase.sol";

contract ILendingPool {
    function flashLoan( address payable _receiver, address _reserve, uint _amount, bytes calldata _params) external;
}

contract bAnimal is ERC721Full, DefiNFTInterface, FlashLoanReceiverBase {
    // mainnet
    // address public constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant AAVE_LENDING_POOL = 0x398eC7346DcD622eDc5ae82352F02bE94C62d119;
    // address public constant AAVE_LENDING_POOL_CORE = 0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3;

    // kovan
    address public constant DAI_ADDRESS = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
    address public constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address public constant AETH_ADDRESS =  0xD483B49F2d55D2c53D32bE6efF735cB001880F79;
    address public constant AAVE_LENDING_POOL = 0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c;
    address public constant AAVE_LENDING_POOL_CORE = 0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45;
    address public constant WETH_ADDRESS = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
    ILendingPoolAddressesProvider public LENDING_POOL_ADDRESS_PROVIDER = ILendingPoolAddressesProvider(0x506B0B2CF20FAA8f38a4E2B524EE43e1f4458Cc5);


    address public farm;
    address payable public oasisWrapper;

    mapping(uint => string) public names;
    mapping(uint => address payable) public keeper;
    mapping(uint => uint) public debt;

    constructor (address _farm, address payable _oasisWrapper) public ERC721Full('aAnimal', 'AAN') FlashLoanReceiverBase(LENDING_POOL_ADDRESS_PROVIDER) { 
        farm = _farm;
        oasisWrapper = _oasisWrapper;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(owner);
    }

    function mintDefiNFT(address _user, uint _value, string calldata _name) external payable returns(bool) {
        require(msg.sender == farm);
        require(msg.value >= _value);
        
        uint tokenId = totalSupply();
        
        _mint(_user, tokenId);

        uint tokensBefore = IERC20(AETH_ADDRESS).balanceOf(address(this));

        uint daiAmountToExchange = OasisWrapper(oasisWrapper).getSellAmount(DAI_ADDRESS, WETH_ADDRESS, _value);

        AaveLendingPoolInterface(AAVE_LENDING_POOL).setUserUseReserveAsCollateral(ETH_ADDRESS, true);

        // flash loan that amount of DAI
        bytes memory paramsData = abi.encode(tokenId, _value, _name, tokensBefore);
        ILendingPool(AAVE_LENDING_POOL).flashLoan(address(this), ETH_ADDRESS, _value, paramsData);

        return true;
    }

    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params) 
    external {

        //check the contract has the specified balance
        require(_amount <= getBalanceInternal(address(this), _reserve), 
            "Invalid balance for the contract");

        (
            uint tokenId,
            uint value,
            string memory name,
            uint tokensBefore
        ) 
         = abi.decode(_params, (uint256,uint256,string,uint256));

        IERC20(DAI_ADDRESS).transfer(oasisWrapper, _amount);
        OasisWrapper(oasisWrapper).swapTokenToEther(DAI_ADDRESS, _amount);

        AaveLendingPoolInterface(AAVE_LENDING_POOL).deposit.value(value*2)(ETH_ADDRESS, value*2, 0);

        uint diff = IERC20(AETH_ADDRESS).balanceOf(address(this)) - tokensBefore;

        FundsKeeper fundsKeeper = new FundsKeeper();
        IERC20(AETH_ADDRESS).transfer(address(fundsKeeper), diff);

        fundsKeeper.borrow(_amount.add(_fee));

        address payable receiver = address(uint160(address(fundsKeeper)));
        keeper[tokenId] = receiver;
        names[tokenId] = name;
        debt[tokenId] = _amount.add(_fee);

        transferFundsBackToPoolInternal(_reserve, _amount.add(_fee));
    }

    function getName(uint _id) external view returns(string memory) {
        return names[_id];
    }

    function burn(uint256 _tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721Burnable: caller is not owner nor approved");

        uint debtNeeded = debt[_tokenId];

        require(IERC20(DAI_ADDRESS).transferFrom(msg.sender, address(this), debtNeeded));
        IERC20(DAI_ADDRESS).approve(AAVE_LENDING_POOL_CORE, debtNeeded);

        // Repay users debt
        AaveLendingPoolInterface(AAVE_LENDING_POOL).repay(ETH_ADDRESS, debtNeeded, keeper[_tokenId]);

        FundsKeeper(keeper[_tokenId]).withdrawTokens(AETH_ADDRESS);

        uint balance = IERC20(AETH_ADDRESS).balanceOf(address(this));
        aTokenInterface(AETH_ADDRESS).redeem(balance);

        msg.sender.transfer(address(this).balance);

        _burn(_tokenId);
    }

    function getBalance(uint _tokenId) public view returns(uint) {
        return IERC20(AETH_ADDRESS).balanceOf(keeper[_tokenId]);
    }

    function getTokenData(uint _tokenId) public view returns(string memory, uint, uint) {
        return (names[_tokenId], getBalance(_tokenId), debt[_tokenId]); 
    }

    function () external payable {
    }
    
}
