const Animal = artifacts.require("./aAnimal.sol");
const DefiFarm = artifacts.require("./DefiFarm.sol");

require('dotenv').config();

module.exports = function(deployer, network, accounts) {
    let deployAgain = (process.env.DEPLOY_AGAIN === 'true') ? true : false;

    deployer.then(async () => {
        // --------- first deploy this part ---------------------------------
        await deployer.deploy(DefiFarm, {gas: 4000000, overwrite: deployAgain})
        let defiFarm = await DefiFarm.deployed()

        await deployer.deploy(Animal, defiFarm.address, {gas: 4000000, overwrite: deployAgain})
        let first = await Animal.deployed();
        await defiFarm.addToken(first.address, '10000000000000000');

        await deployer.deploy(Animal, defiFarm.address, {gas: 4000000, overwrite: deployAgain})
        let second = await Animal.deployed();
        await defiFarm.addToken(second.address, '20000000000000000');
    });
};