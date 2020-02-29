import React, { Component } from "react";

import getWeb3 from "../utils/getWeb3.js";

import { Link } from 'react-router-dom'


import monster1Img from '../images/monster1.png';
import monster2Img from '../images/monster2.png';

class HomePage extends Component {
  
    constructor(je) {
        super(je);

        this.state = {
            account: null,
            web3: null,
            networkId: '',
            m1Name: '',
            m1Value: 0,
            m2Name: '',
            m2Value: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = async () => {
        try {
          const web3 = await getWeb3();

          // Use web3 to get the user's accounts.
          const accounts = await web3.eth.getAccounts();
    
          const networkId = await web3.eth.net.getId();

          this.setState({
            web3,
            account: accounts[0],
            networkId,
           });

        } catch(err) {
            console.log(err);
        }
    }

    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value,
          price: '0',
        });
    }

    async buy(type) {
        console.log('Buy: ', type);

    }

    render() {

        const { m1Name, m1Value, m2Name, m2Value } = this.state;

        return (
            <div>
                <div className="container main-container">
                    <div className="title-section">
                        <h1>Defi Farm</h1>

                        <Link to='/profile'> Profile </Link>
                    </div>

                    <div className="body-section row">
                        <div className="first-section col-lg-6">
                            <div>
                                <img src={monster1Img} alt="monster1" width="300" height="390" />

                                <div className="input-section">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="m1Name"
                                        onChange={this.handleChange}
                                        placeholder="Name"
                                        value={m1Name}
                                    />

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="m1Value"
                                        onChange={this.handleChange}
                                        placeholder="Name"
                                        value={m1Value}
                                    />
                                </div>

                                <button type="button" className="btn btn-primary" onClick={() => this.buy('monster1')}>Buy</button>
                            </div>
                        </div>

                        <div className="second-section col-lg-6">
                            <div>
                                <img src={monster2Img} alt="monster2" width="300" height="390" />

                                <div className="input-section">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="m2Name"
                                        onChange={this.handleChange}
                                        placeholder="Name"
                                        value={m2Name}
                                    />

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="m2Value"
                                        onChange={this.handleChange}
                                        placeholder="Name"
                                        value={m2Value}
                                    />
                                </div>

                                <button type="button" className="btn btn-primary" onClick={() => this.buy('monster2')}>Buy</button>
                            </div>
                        </div>
                    </div>

                    <div className="footer-section">
                        Explanation
                    </div>
                </div>
            </div>
        );
    }
}

export default HomePage;
