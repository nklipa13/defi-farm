import React, { Component } from "react";

import "./Monster.css";

class Monster extends Component {

    constructor(je) {
        super(je);

        this.state = {
            name: '',
            value: 0
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

        await this.checkAllowance(value);

        const tokenInfo = await contract.methods.tokens(tokenId).call();

        console.log('Buy: ', tokenInfo);

        const weiValue = (value * 1e18).toString();

        await contract.methods.buyToken(tokenId, weiValue, name).send({
            from: account,
            value: tokenInfo.price
        });

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
        const { img } = this.props;

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
                        placeholder="Dai Amount"
                        value={value}
                    />
                </div>

                <div className="monster-desc">
                    Eum ea recusandae ducimus. Repellendus occaecati beatae sunt impedit ducimus. Dolores natus et alias.
                    Sed velit non pariatur vel aut consequatur aut ut.
                </div>

                <button type="button" className="buy-btn" onClick={() => this.buy()}>Buy</button>
            </div>
        );
    }

}

export default Monster;
