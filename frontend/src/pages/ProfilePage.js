import React, { Component } from "react";

import getWeb3 from "../utils/getWeb3.js";

import { NFT, NFT2, Dai } from '../config.json';

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
            nft2Addr: '',
            nft1Contract: null,
            nft2Contract: null,
            daiContract: null,
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

          const nft1Addr = "0x7181Bf93d5F68F150802842A352F6B40e2F26be2";
          const nft2Addr = '0xc92ffB729ba3F5BBF81A9EF490e11cf14C76d5d0';

          const nft1Contract = new web3.eth.Contract(NFT.abi, nft1Addr);
          const nft2Contract = new web3.eth.Contract(NFT2.abi, nft2Addr);
          const daiContract = new web3.eth.Contract(Dai.abi, Dai.networks[networkId].address);


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

          for (let i = 0; i < ownerTokensM2.length; ++i) {
            const tokenData = await nft2Contract.methods.getTokenData(ownerTokensM2[i]).call();

            console.log(tokenData);

            m2Animals.push({
                name: tokenData[0],
                amountEth: tokenData[1],
                amountDai: tokenData[2],
                tokenId: ownerTokensM2[i],
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
            m2Animals,
            daiContract,
            nft2Addr
           });

        } catch(err) {
            console.log(err);
        }
    }

    async burn(tokenId, type) {

        console.log(tokenId);

        const { account, nft1Contract, nft2Contract, nft2Addr, daiContract } = this.state;

        if (type === 0) {
            await nft1Contract.methods.burn(tokenId).send({ from: account });
        } else {
            await daiContract.methods.approve(nft2Addr, "900000000000000000000000000")
                .send({from: account});

            await nft2Contract.methods.burn(tokenId).send({ from: account });

        }
    }
  
    render() {

        const { m1Animals, m2Animals } = this.state;

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
                                        <button type="button" className="buy-btn" onClick={() => this.burn(animal.tokenId, 0)}>Burn</button>
                                    </div>
                                </div>
                            ))
                        }

{
                            m2Animals.map((animal, i) => (
                                <div key={i} className="monster-container">
                                    <img src={monster2Img} alt="monster2" width="300" height="390" />
                                    <div className='monster-info'>
                                        <div>Name:</div>
                                        <div className="info-text"> {animal.name }</div>
                                        <div>Eth Value:</div>
                                        <div className="info-text"> {(animal.amountEth / 1e18).toFixed(4)} Eth</div>
                                        <div>Dai debt:</div>
                                        <div className="info-text"> {(animal.amountDai / 1e18).toFixed(4)} Dai</div>
                                        <button type="button" className="buy-btn" onClick={() => this.burn(animal.tokenId, 1)}>Burn</button>
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
