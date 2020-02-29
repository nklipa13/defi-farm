import React, { Component } from "react";

import getWeb3 from "../utils/getWeb3.js";

import { Link } from 'react-router-dom'

import { DefiFarm, Dai } from '../config.json';

import monster1Img from '../images/monster1.png';
import monster2Img from '../images/monster2.png';

import Monster from "../components/Monster";

import "./HomePage.css";

class HomePage extends Component {
  
    constructor(je) {
        super(je);

        this.state = {
            account: null,
            web3: null,
            networkId: '',
            defiFarmContract: null,
            daiContract: null,
            m1Name: '',
            m1Value: 0,
            m2Name: '',
            m2Value: 0,
        };
    }

    componentDidMount = async () => {
        try {
          const web3 = await getWeb3();

          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();

          const defiFarmContract = new web3.eth.Contract(DefiFarm.abi, DefiFarm.networks[networkId].address);
          const daiContract = new web3.eth.Contract(Dai.abi, Dai.networks[networkId].address);

          this.setState({
            web3,
            account: accounts[0],
            networkId,
            defiFarmContract,
            daiContract
           });

        } catch(err) {
            console.log(err);
        }
    }

    render() {

        const { defiFarmContract, account, daiContract } = this.state;

        return (
            <div className="container-flex">
                <div className="page-layout">
                    <div className="title-section">
                        <div className="title-text">Defi Farm</div>
                        <Link to='/profile' className="profile-link"> Profile </Link>
                    </div>

                    <div className='description-section'>
                        Your virtual pets that work for you and will die to save your defi positions!
                    </div>

                    <div className="body-section">
                        <div className="first-section">
                            <Monster 
                                img={monster1Img} 
                                tokenId="0" 
                                contract={defiFarmContract} 
                                account={account}
                                daiContract={daiContract}
                                inputPlaceholder="Amount Dai"
                                >
                            </Monster>
                        </div>

                        <div className="second-section">
                            <Monster 
                                img={monster2Img} 
                                tokenId="1" 
                                contract={defiFarmContract} 
                                account={account}
                                daiContract={daiContract}
                                inputPlaceholder="Amount Eth"
                            >
                            </Monster>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
