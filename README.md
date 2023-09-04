# RetroWeb3.Games

RetroWeb3.Games is a platform that collects classic/retro games in Web3 utilizing the Oasys blockchain and zkSNARK. By transforming games that many people are already familiar with into Web3 versions, it can eliminate the learning curve and enable anyone to seamlessly experience Web3 gaming.

The integration of zkSNARK allows us to ensure efficient game generation and execution, combining the scalability of off-chain processing with the trustless nature of on-chain smart contracts.

- [Live URL](https://www.retroweb3.games)
- [YouTube](https://youtu.be/l0b7pecqp90)
- [Short Presentation](https://rb.gy/3y53x)
- [Akindo](https://app.akindo.io/communities/mVzXN4vBRi3wjPa6/products/93XEqKwVAfv6oxMn)

## Game Available

- Minesweeper - A classic puzzle game where the objective is to uncover cells on a grid without hitting hidden bombs, anyone can flag hidden bombs by deposit 0.01 OAS tokens and the person who flags the last mine will win the prize pool.

## How It Works

There is one game, Minesweeper contains Circom's circuit and the main contract that inherits the autogenerated verifier contract made by snarkjs. Initially, the puzzle board must be generated by the server and saved in the database internally. The board will be hashed using Poseidon hash and sent back to the user to create the game on the smart contract.

![Untitled Diagram drawio (13)](https://github.com/pisuthd/retro-web3-games/assets/18402217/9d8a5f1d-4527-4f0b-a52d-68d6dad2f241)

Once the game is ready, the user selects a cell to reveal and the coordinates are sent to the server to check if the cell contains a bomb or not. A zk-proof is generated and sent back to the user then can uses it to reveal the cell on-chain.

By right-clicking, you will flag a bomb and deposit 0.01 OAS tokens to the prize pool. The last person to correctly flag the bomb will receive the entire prize. However, if the game is lose, the prize will be carried over to the next round.

## Repository structure

The project using a monorepo structure consists of 4 different packages that have been interconnected using [Lerna](https://lerna.js.org).

- `client`: the frontend application made with [React](https://react.dev/) and [React95](https://github.com/React95/React95), incorporates the necessary Web3 and ZK libraries.
- `contracts`: contains [Circom](https://docs.circom.io/)'s circuits and a `Minesweeper.sol` main contract that inherits the autogenerated verifier contracts made from [snarkjs](https://github.com/iden3/snarkjs). 
- `lib`: source code for server node, separate for better unit and integration tests with other package.
- `server`: the server node contains the document database implemented using [PouchDB](https://pouchdb.com/),  processes all game operations and also incorporates ZK libraries for generating zk-proofs to reveal cells and flag bombs.

## Getting started

All Circom circuits have been compiled and placed at `/packages/contracts/circuits` folder, you can follow the instructions provided at this [link](https://docs.circom.io/getting-started/installation/) to manually compile them.

### Install dependencies
Since we are using Lerna, all dependencies across all packages can be installed by running following command at the root folder:

```
npm run bootstrap
```

Most of the core libraries that the project is using require Node.js 18. Make sure you have it installed, otherwise, errors may occur.

### Tests

After installing all dependencies, you can run the unit and integration tests to verify that all packages are working as intended.


```
npm run package:lib
```
Then open another console and run:
```
npm run test
```

### Deploy smart contracts

By default, the frontend is initially configured to connect to the smart contract that we have deployed on Oasys Sandverse chain. 

However, if you wish to deploy a new contract, you then need to replace the new contract address in `packages/client/src/constants.js`

```
export const contractAddress = "0xB2987B64f29E194b6134255bC960Da91183a06B0" // replace with your contract here
```

### Run

When everything is set, you can start the entire system by running the command:

```
npm start
```

This will run a server node on port 8000 and the frontend on port 3000. Visit http://localhost:3000 to start using it.

You can check out the YouTube video on how to play.

The Docker configuration file and AWS ECS cluster deployment script are included but detailed instruction are not provided here.

## Deployment

### Saakuru Testnet

Contract Name | Contract Address 
--- | --- 
Faucet | 0x13E6B05BD8D45aE843674F929A94Edd32BD5e3d9 
GameItem | 0xCFFcB7982f9831Ac805a83F61D701Bfd5340c2E6
Minesweeper | 0xe87A1c7cfE6458CAc665d50CDb85c59E97F3b124
Blackjack | 0x59A89D64B08CA6832F20bfEE4C1CE18EEebC02F4
TomoSitter | 0x1Bb6bDf61077cd3f9e61bfCFc3F12f044637dD1a
