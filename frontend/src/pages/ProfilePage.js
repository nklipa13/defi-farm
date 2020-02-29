import React, { Component } from "react";

import getWeb3 from "../utils/getWeb3.js";

import { NFT } from '../config.json';

import monster1Img from '../images/monster1.png';
import monster2Img from '../images/monster2.png';

import "./ProfilePage.css";
import "./HomePage.css";

import { Link } from 'react-router-dom'

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
                amount: tokenData[1],
                tokenId: ownerTokensM1[i]
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

    async burn(tokenId) {

        const { account, nft1Contract } = this.state;

        await nft1Contract.methods.burn(tokenId).send({ from: account });
    }
  
    render() {

        const { m1Animals } = this.state;

        return (
            <div className="container-flex">
                <div className="page-layout">
                    <div className="title-section">
                        <div className="title-text">Defi Farm</div>
                        <Link to='/' className="profile-link"> Back </Link>
                    </div>
                    <div className="profile-layout">
                        {
                            m1Animals.map((animal, i) => (
                                <div key={i} className="monster-container">
                                    <img src={monster1Img} alt="monster1" width="300" height="390" />
                                    <div className='monster-info'>
                                        <div>Name:</div>
                                        <div className="info-text"> {animal.name }</div>
                                        <div>Value:</div>
                                        <div className="info-text"> {(animal.amount / 1e18).toFixed(4)} Dai</div>
                                        <button type="button" className="buy-btn" onClick={() => this.burn(animal.tokenId)}>Burn</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfilePage;
