# RetroWeb3.Games

RetroWeb3.Games is a platform that collects classic/retro games in Web3 utilizing the Oasys L2 Saakuru blockchain. By transforming games that many people are already familiar with into Web3 versions, it can eliminate the learning curve and enable anyone to seamlessly experience Web3 gaming.

- [Live URL](https://www.retroweb3.games)
- [YouTube](https://youtu.be/7FRJeW4age0)
- [Short Presentation](https://rb.gy/3y53x)

## Game Available (3)

- Minesweeper - A classic puzzle game where the objective is to uncover cells on a grid without hitting hidden bombs, anyone can flag hidden bombs by deposit Flag NFT and the person who flags the last mine will win the prize pool.
- Blackjack - A classic card game where the objective is to have a hand value as close to 21 as possible and compete against the dealer.
  Tomo Playground - Tomo Playground - A mini-game where Tomo's virtual pet can socialize with others and earn happiness points.

## Repository structure

The project using a monorepo structure consists of 2 different packages that have been interconnected using [Lerna](https://lerna.js.org).

- `client`: the frontend application made with [React](https://react.dev/) and [React95](https://github.com/React95/React95), incorporates the necessary Web3 libraries.
- `app`: the server node contains the document database implemented using [PouchDB](https://pouchdb.com/),  processes all game operations 

## Getting started

### Install dependencies
Since we are using Lerna, all dependencies across all packages can be installed by running following command at the root folder:

```
npm run bootstrap
```

Most of the core libraries that the project is using require Node.js 18. Make sure you have it installed, otherwise, errors may occur.

### Tests

After installing all dependencies, you can run the unit and integration tests to verify that all packages are working as intended.

```
npm run test
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
