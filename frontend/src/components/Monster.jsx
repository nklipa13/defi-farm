import React, { Component } from "react";

import "./Monster.css";

class Monster extends Component {

    constructor(je) {
        super(je);

        this.state = {
            name: '',
            value: 'Amount Eth'
        }

        this.handleChange = this.handleChange.bind(this);
    }

    async checkAllowance(userValue) {
        const { daiContract, account, contract } = this.props;
        console.log(contract._address);

        const allowanceAmount = await daiContract.methods.allowance(account, contract._address).call();

        if (allowanceAmount / 1e18 < userValue) {
            await daiContract.methods.approve(contract._address, "900000000000000000000000000")
                .send({from: account});
        }
    }

    async buy() {
        const { tokenId, contract, account } = this.props;
        const { name, value } = this.state;

        if (tokenId === "0") {
            await this.checkAllowance(value);
        }

        const tokenInfo = await contract.methods.tokens(tokenId).call();

        console.log('Buy: ', tokenInfo.price);

        const ethAmount = parseFloat(value) + parseFloat(tokenInfo.price / 1e18);

        console.log(ethAmount);

        const weiValue = (value * 1e18).toString();

        if (tokenId === "0") {
            await contract.methods.buyToken(tokenId, weiValue, name).send({
                from: account,
                value: tokenInfo.price
            });
        } else {
            await contract.methods.buyToken(tokenId, weiValue, name).send({
                from: account,
                value: (ethAmount * 1e18).toString()
            });
        }

        this.setState({
            name: '',
            value: 0
        });
    }

    handleChange(e) {
        this.setState({
          [e.target.name]: e.target.value,
        });
    }

    render() {
        const { name, value } = this.state;
        const { img, inputPlaceholder, tokenId } = this.props;

        return (
            <div>
                <div className="img-container">
                    <img src={img} alt="monster1" width="300" height="390" />
                </div>

                <div className="input-section">
                    <input
                        type="text"
                        className="form-input"
                        name="name"
                        onChange={this.handleChange}
                        placeholder="Name"
                        value={name}
                    />

                    <input
                        type="number"
                        className="form-input"
                        name="value"
                        onChange={this.handleChange}
                        placeholder={inputPlaceholder}
                        value={value}
                    />
                </div>

                {
                    tokenId === "0" && 
                    <div className="monster-desc">
                        <span className="asset-name">aSavers</span> - A type of NFT that will eat your Dai and store in their belly.
                        This will earn you pasive interest over time which you can exit at anytime by sacrificing your aSaver.
                    </div>
                }

                {
                    tokenId === "1" && 
                    <div className="monster-desc">
                        <span className="asset-name">aTraders</span> - A type of NFT that will eat your Eth and go all in, with a leverage!
                        This is a really risky animal that might get killed in the price crashed but can earn you money quickly!
                    </div>
                }

                <button type="button" className="buy-btn" onClick={() => this.buy()}>Buy</button>
            </div>
        );
    }

}

export default Monster;
