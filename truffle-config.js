/* vim: ts=2:sw=2:et
 *
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * truffleframework.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like truffle-hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura API
 * keys are available for free at: infura.io/register
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const JSON5 = require('json5');

let infuraProjectId = null, infuraProjectSecret = null;
try {
  const localConfStr = fs.readFileSync('local.jsonc', { encoding: 'utf8' });
  const localConf = JSON5.parse(localConfStr);
  let t = localConf['infura_project_id'];
  if (t) {
    infuraProjectId = t;
  }
  t = localConf['infura_project_secret'];
  if (t) {
    infuraProjectSecret = t;
  }
} catch (err) {
  if (err.code !== 'ENOENT') {
    throw err;
  }
}
let privateKeys;
try {
  privateKeys = fs.readFileSync('.private-keys', {encoding: 'ascii'}).split('\n').filter(x => x.length > 0);
} catch (err) {
  if (err.code === 'ENOENT') {
    privateKeys = null;
  } else {
    throw err;
  }
}

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "5777",       // Any network (default: none)
    },

    // Another network with more advanced options...
    // advanced: {
      // port: 8777,             // Custom port
      // network_id: 1342,       // Custom network
      // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
      // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send txs from (default: accounts[0])
      // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    devnet: {
      host: '127.0.0.1',      // Localhost
      port: 8545,             // Custom port
      network_id: '*',         // local chain
      //gas: 1000000,           // Gas sent with each transaction (default: ~6700000)
      gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
      // from: <address>,        // Account to send txs from (default: accounts[0])
      websockets: false        // Enable EventEmitter interface for web3 (default: false)
    },

    'localchain': {
      provider: () => {
        if (privateKeys === null) {
          throw (new Error('Create a .private-keys file'));
        }
        return new HDWalletProvider(privateKeys, 'http://localhost:8545', 0 /*address_index*/, privateKeys.length/*num_addresses*/);
      },
      network_id: '19',
    },

    'thunder-venus': {  // `venus` is the first PaLa R1 testnet. It coexisted with `thunder-testnet` for a short while.
      provider: () => {
        if (privateKeys === null) {
          throw (new Error('Create a .private-keys file'));
        }
        return new HDWalletProvider(privateKeys, 'https://venus-rpc.thundercore.com', 0 /*address_index*/, privateKeys.length/*num_addresses*/);
      },
      network_id: '18',
    },

    'thunder-testnet': {
      provider: () => {
        if (privateKeys === null) {
          throw (new Error('Create a .private-keys file'));
        }
        return new HDWalletProvider(privateKeys, 'https://testnet-rpc.thundercore.com', 0 /*address_index*/, privateKeys.length/*num_addresses*/);
      },
      network_id: '18',
    },

    'thunder-mainnet': {
      provider: () => {
        if (privateKeys === null) {
          throw (new Error('Create a .private-keys file'));
        }
        return new HDWalletProvider(privateKeys, 'https://mainnet-rpc.thundercore.com', 0 /*address_index*/, privateKeys.length/*num_addresses*/);
      },
      network_id: '108',
    },

    ropsten: {
      provider: () => {
        if (privateKeys === null) {
          throw (new Error('Create a .private-keys file'));
        }
        if (infuraProjectId === null) {
          throw (new Error('Set "infura_project_id" in local.jsonc'));
        }
        if (infuraProjectSecret === null) {
          throw (new Error('Set "infura_project_secret" in local.jsonc'));
        }
        // FIXME: infuraProjectSecret not used yet
        return new HDWalletProvider(privateKeys, `https://ropsten.infura.io/v3/${infuraProjectId}`, 0 /*address_index*/,
          privateKeys.length/*num_address*/);
      },
      network_id: 3
    },

    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
      // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraKey}`),
      // network_id: 3,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },

    // Useful for private networks
    // private: {
      // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
      // network_id: 2111,   // This network is yours, in the cloud.
      // production: true    // Treats this network as if it was a public net. (default: false)
    // }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.4.25",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {           // see the solidity docs for advice about optimization and evmversion
        optimizer: {
          enabled: false,
          runs: 200
        },
        evmVersion: "byzantium"
      }
    }
//    solc: {
//      version: "native",
//      settings: {           // see the solidity docs for advice about optimization and evmversion
//        optimizer: {
//          enabled: true,
//          runs: 200
//        },
//      }
//      evmVersion: "byzantium"
//  }
  }
}
