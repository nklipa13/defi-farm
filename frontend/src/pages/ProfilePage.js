import React, { Component } from "react";

import getWeb3 from "../utils/getWeb3.js";

import { NFT } from '../config.json';

import monster1Img from '../images/monster1.png';
import monster2Img from '../images/monster2.png';

class ProfilePage extends Component {

    constructor(je) {
        super(je);

        this.state = {
            account: null,
            web3: null,
            networkId: '',
            nft1Contract: null,
            nft2Contract: null,
            m1Animals: [],
            m2Animals: [],
        };
    }

    componentDidMount = async () => {
        try {
          const web3 = await getWeb3();

          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();

          const nft1Addr = "0xBD3B64D13f4c87A5146EbFe6AAbd857B96686376";
          const nft2Addr = '0x90443A2c797BEF238aba6f94de716267faa904ba';

          const nft1Contract = new web3.eth.Contract(NFT.abi, nft1Addr);
          const nft2Contract = new web3.eth.Contract(NFT.abi, nft2Addr);

          const ownerTokensM1 = await nft1Contract.methods.tokensOfOwner(accounts[0]).call();
          const ownerTokensM2 = await nft2Contract.methods.tokensOfOwner(accounts[0]).call();

          const m1Animals = [];
          const m2Animals = [];

          for (let i = 0; i < ownerTokensM1.length; ++i) {
            const tokenData = await nft1Contract.methods.getTokenData(ownerTokensM1[i]).call();

            m1Animals.push({
                name: tokenData[0],
                amount: tokenData[1]
            });
          }

          console.log(m1Animals);

          this.setState({
            web3,
            account: accounts[0],
            networkId,
            nft1Contract,
            nft2Contract,
            m1Animals,
            m2Animals
           });

        } catch(err) {
            console.log(err);
        }
    }
  
    render() {

        const { m1Animals } = this.state;

        return (
            <div>
                {
                    m1Animals.map((animal, i) => (
                        <div key={i}>
                            <img src={monster1Img} alt="monster1" width="300" height="390" />
                            <div> {animal.name }</div>
                            <div> {animal.amount / 1e18} Dai</div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default ProfilePage;
