pragma solidity ^0.5.0;

interface DefiNFTInterface {
    function mintDefiNFT(address _user, uint _value) external returns(bool);
}
