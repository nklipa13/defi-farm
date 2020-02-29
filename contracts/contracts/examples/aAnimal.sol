pragma solidity ^0.5.0;

import "../DefiNFTInterface.sol";
import "./AaveLendingPoolInterface.sol";
import "./aTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FundsKeeper.sol";

contract aAnimal is ERC721Full, DefiNFTInterface {
    // mainnet
    // address public constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant ADAI_ADDRESS = 0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d;
    // address public constant AAVE_LENDING_POOL = 0x398eC7346DcD622eDc5ae82352F02bE94C62d119;
    // address public constant AAVE_LENDING_POOL_CORE = 0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3;

    // kovan
    address public constant DAI_ADDRESS = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
    address public constant ADAI_ADDRESS = 0x58AD4cB396411B691A9AAb6F74545b2C5217FE6a;
    address public constant AAVE_LENDING_POOL = 0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c;
    address public constant AAVE_LENDING_POOL_CORE = 0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45;

    address public farm;

    mapping(uint => string) public names;
    mapping(uint => address) public keeper;

    constructor (address _farm) public ERC721Full('aAnimal', 'AAN') { 
        farm = _farm;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function tokensOfOwner(address owner) public view returns (uint256[] memory) {
        return _tokensOfOwner(owner);
    }

    function mintDefiNFT(address _user, uint _value, string calldata _name) external payable returns(bool) {
        require(msg.sender == farm);
        require(msg.value == 0);
        
        uint tokenId = totalSupply();
        
        _mint(_user, tokenId);

        require(IERC20(DAI_ADDRESS).transferFrom(farm, address(this), _value));
        IERC20(DAI_ADDRESS).approve(AAVE_LENDING_POOL_CORE, _value);

        uint tokensBefore = IERC20(ADAI_ADDRESS).balanceOf(address(this));

        AaveLendingPoolInterface(AAVE_LENDING_POOL).deposit(DAI_ADDRESS, _value, 0);

        uint diff = IERC20(ADAI_ADDRESS).balanceOf(address(this)) - tokensBefore;

        FundsKeeper fundsKeeper = new FundsKeeper();
        IERC20(ADAI_ADDRESS).transfer(address(fundsKeeper), diff);

        keeper[tokenId] = address(fundsKeeper);
        names[tokenId] = _name;

        return true;
    }

    function getName(uint _id) external view returns(string memory) {
        return names[_id];
    }

    function burn(uint256 _tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), _tokenId), "ERC721Burnable: caller is not owner nor approved");

        uint tokensBefore = IERC20(DAI_ADDRESS).balanceOf(address(this));

        FundsKeeper(keeper[_tokenId]).withdrawTokens(ADAI_ADDRESS);

        uint balance = IERC20(ADAI_ADDRESS).balanceOf(address(this));
        aTokenInterface(ADAI_ADDRESS).redeem(balance);
        uint diff = IERC20(DAI_ADDRESS).balanceOf(address(this));

        IERC20(DAI_ADDRESS).transfer(_msgSender(), diff);

        _burn(_tokenId);
    }

    function getBalance(uint _tokenId) public view returns(uint) {
        return IERC20(ADAI_ADDRESS).balanceOf(keeper[_tokenId]);
    }

    function getTokenData(uint _tokenId) public view returns(string memory, uint) {
        return (names[_tokenId], getBalance(_tokenId)); 
    }
    
}
