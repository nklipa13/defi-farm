pragma solidity >=0.4.21 <0.7.0;

contract DefiFarm {
    
    struct DefiNFT {
        address tokenAddress;
        uint price;
        address tokenMaker;
        bool exists;
    }

    uint public count;

    mapping(uint => DefiNFT) public tokens;

    // TODO: add approval period
    function addToken(address _tokenAddress, uint _price) public payable {
        require(msg.value >= _price);

        if (msg.value > _price) {
            msg.sender.transfer(msg.value - _price);
        }

        tokens[count] = DefiNFT({
            tokenAddress: _tokenAddress,
            price: _price,
            tokenMaker: msg.sender,
            exists: true
        });

        count++;
    }

    function buyToken(uint _tokenId) public payable {
        uint tokenPrice = tokens[_tokenId].price;
        require(msg.value >= tokenPrice);
        require(tokens[_tokenId].exists);

        if (msg.value > tokenPrice) {
            msg.sender.transfer(msg.value - tokenPrice);
        }

        // TODO: mint token
    }

    // TODO: only dao
    function removeToken(uint _id) public {
        tokens[_id].exists = false;
    }
}
