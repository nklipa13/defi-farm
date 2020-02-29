import React, { Component } from "react";

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
            daiContract.methods.approve(contract._address, "900000000000000000000000000")
                .send({from: account});
        }
    }

    async buy() {
        const { tokenId, contract, account } = this.props;
        const { name, value } = this.state;

        await this.checkAllowance(value);

        const tokenInfo = await contract.methods.tokens(tokenId).call();

        console.log('Buy: ', tokenInfo);

        await contract.methods.buyToken(tokenId, value, name).send({
            from: account,
            value: tokenInfo.price
        })
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
                <img src={img} alt="monster1" width="300" height="390" />

                <div className="input-section">
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        onChange={this.handleChange}
                        placeholder="Name"
                        value={name}
                    />

                    <input
                        type="number"
                        className="form-control"
                        name="value"
                        onChange={this.handleChange}
                        placeholder="Name"
                        value={value}
                    />
                </div>

                <button type="button" className="btn btn-primary" onClick={() => this.buy()}>Buy</button>
            </div>
        );
    }

}

export default Monster;
