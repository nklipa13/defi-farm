import React, { Component } from "react";

import getWeb3 from "../utils/getWeb3.js";

class HomePage extends Component {
  
    constructor(je) {
        super(je);

        this.state = {
            account: null,
            web3: null,
            networkId: '',
        };
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

    render() {
        return (
            <div>
                HomePage
            </div>
        );
    }
}

export default HomePage;
