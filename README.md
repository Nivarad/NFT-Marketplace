# NFT Marketplace
## Blockchain project submitted by Niv Arad & Gal Karasnty during Blockchain course at Afeka collage of engineering

## Technology Stack & Tools
- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)

# Setting Up
## dependencies to install to run program (need to preformed only once)
    npm install
    npm install @openzeppelin/contracts
    npm install react-router-dom@6
    npm install ipfs-http-client@56.0.1

## Launch Frontend
    npm run start

## start hardhat - on diff node
    npx hardhat node

## Migrate Smart Contracts (deploy)
    npx hardhat run src/backend/scripts/deploy.js --network localhost

### Connect development blockchain accounts to Metamask
- Copy private key of the addresses and import to Metamask
- Connect your metamask to hardhat blockchain, network 127.0.0.1:8545.
- If you have not added hardhat to the list of networks on your metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networks then click add networks. A form should pop up. For the "Network Name" field enter "Hardhat". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "31337". Then click save.