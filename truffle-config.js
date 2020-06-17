const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const mnemonic = 'XXX_XXX_XXX';

module.exports = {

  contracts_build_directory: path.join(__dirname, 'my-app/src/contracts'),

  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*'
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, 'xxx_xxx_xxx'),
      network_id: 4
    }
  },
}
