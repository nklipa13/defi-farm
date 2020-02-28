pragma solidity ^0.5.0;

interface DefiNFTInterface {

    function mintDefiNFT(address _user, uint _value, string calldata _name) external returns(bool);
    function getName(uint _id) external view returns(string memory);
}
