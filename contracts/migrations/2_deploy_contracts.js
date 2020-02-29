const aAnimal = artifacts.require("./aAnimal.sol");
const bAnimal = artifacts.require("./bAnimal.sol");
const DefiFarm = artifacts.require("./DefiFarm.sol");
const OasisWrapper = artifacts.require("./OasisWrapper.sol");

require('dotenv').config();

module.exports = function(deployer, network, accounts) {
    let deployAgain = (process.env.DEPLOY_AGAIN === 'true') ? true : false;

    deployer.then(async () => {
        // --------- first deploy this part ---------------------------------
        await deployer.deploy(DefiFarm, {gas: 4000000, overwrite: deployAgain})
        let defiFarm = await DefiFarm.deployed()

        await deployer.deploy(aAnimal, defiFarm.address, {gas: 6000000, overwrite: deployAgain})
        let first = await aAnimal.deployed();
        await defiFarm.addToken(first.address, '10000000000000000');

        await deployer.deploy(OasisWrapper, {gas: 4000000, overwrite: deployAgain});
        let wrapper = await OasisWrapper.deployed();

        await deployer.deploy(bAnimal, defiFarm.address, wrapper.address, {gas: 6000000, overwrite: deployAgain})
        let second = await bAnimal.deployed();
        await defiFarm.addToken(second.address, '20000000000000000');

        console.log('farm', defiFarm.address);
        console.log('aAnimal', first.address);
        console.log('bAnimal', second.address);
    });
};