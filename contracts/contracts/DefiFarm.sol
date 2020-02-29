pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import "./DefiNFTInterface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DefiFarm {

    // address public constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant ADAI_ADDRESS = 0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d;
    // address public constant AAVE_LENDING_POOL = 0x398eC7346DcD622eDc5ae82352F02bE94C62d119;

    // kovan
    address public constant DAI_ADDRESS = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;
    
    struct DefiNFT {
        address tokenAddress;
        uint price;
        address payable tokenMaker;
        bool exists;
    }

    uint public USER_SHARE = 5;

    uint public count;

    DefiNFT[] public tokens;

    address payable public owner;

    constructor() public {
        owner = msg.sender;
    }

    // TODO: add approval period
    function addToken(address _tokenAddress, uint _price) public payable {
        tokens.push(
            DefiNFT({
                tokenAddress: _tokenAddress,
                price: _price,
                tokenMaker: msg.sender,
                exists: true
            })
        );
    }

    function buyToken(uint _tokenId, uint _value, string memory _name) public payable {
        uint tokenPrice = tokens[_tokenId].price;
        require(msg.value >= tokenPrice);
        require(tokens[_tokenId].exists);

        if (msg.value > tokenPrice) {
            msg.sender.transfer(msg.value - tokenPrice);
        }

        address payable tokenMaker = tokens[_tokenId].tokenMaker;
        tokenMaker.transfer(tokenPrice * USER_SHARE / 100);

        require(IERC20(DAI_ADDRESS).transferFrom(msg.sender, address(this), _value));
        IERC20(DAI_ADDRESS).approve(tokens[_tokenId].tokenAddress, _value);

        // TODO: mint token
        require(DefiNFTInterface(tokens[_tokenId].tokenAddress).mintDefiNFT(msg.sender, _value, _name));
    }

    // TODO: only dao
    function removeToken(uint _id) public {
        tokens[_id].exists = false;
    }

    // TODO: only dao
    function changeMakerShare(uint _share) public {
        USER_SHARE = _share;
    }

    function getTokens() public view returns(DefiNFT[] memory) {
        return tokens;
    }

    function withdraw(uint _amount) public {
        owner.transfer(_amount);
    }
}
