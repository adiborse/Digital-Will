# Blockchain-Based Digital Will System

A beginner-friendly blockchain project that stores a digital will on Ethereum and releases it only to the nominee after a fixed time. It uses Solidity for the smart contract, Hardhat for local blockchain development, and HTML/CSS/JavaScript with ethers.js for the frontend.

## Problem Statement

Traditional wills depend on manual storage, trust, and intermediaries. In a digital system, sensitive inheritance data should be:

- stored securely
- protected from unauthorized access
- released only to the correct person
- transparent and tamper-resistant

This project demonstrates how blockchain can solve that problem with a simple smart contract.

## Solution Overview

The owner stores will data inside a smart contract. The contract also stores:

- the owner address
- the nominee address
- the release time

Only the owner can save the will. Only the nominee can read it, and only after the release time has passed.

## Features

- Store will data on-chain
- Restrict write access to only the owner
- Restrict read access to only the nominee
- Release will data only after a fixed timestamp
- Use MetaMask for wallet interaction
- Use Hardhat for compile, deployment, and local testing
- Clean beginner-friendly frontend with ethers.js

## Tech Stack

- Solidity `0.8.34`
- Hardhat
- ethers.js
- HTML
- CSS
- JavaScript

## Project Structure

```text
blockchain-based-digital-will-system/
|
|-- contracts/
|   |-- DigitalWill.sol
|-- scripts/
|   |-- deploy.js
|-- frontend/
|   |-- index.html
|   |-- style.css
|   |-- app.js
|-- .env.example
|-- .gitignore
|-- hardhat.config.js
|-- LICENSE
|-- package.json
|-- package-lock.json
|-- README.md
```

## Architecture

```text
User -> Frontend -> MetaMask -> Smart Contract -> Local Ethereum Network
```

### Smart Contract

The smart contract handles storage and access control. It decides who can save the will and who can read it later.

### Hardhat Layer

Hardhat is used to:

- compile Solidity code
- run a local Ethereum blockchain
- deploy the smart contract

### Frontend

The frontend allows the user to:

- connect MetaMask
- enter the deployed contract address
- write the will
- save the will
- fetch the will later

## Smart Contract Summary

Contract name: `DigitalWill`

State variables:

- `owner`
- `nominee`
- `willData`
- `releaseTime`

Main functions:

- `setWill(string memory data)` - only owner
- `getWill()` - only nominee and only after release time

Events:

- `WillCreated`
- `WillUpdated`

## How It Works

1. The contract is deployed.
2. The deployer becomes the owner.
3. The script sets a nominee address and release time.
4. The owner connects MetaMask and stores the will.
5. The will stays locked before the release time.
6. After the release time, the nominee can fetch the will.

## Installation and Setup

### 1. Clone the project

```bash
git clone https://github.com/your-username/blockchain-based-digital-will-system.git
cd blockchain-based-digital-will-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Compile the contract

```bash
npm run compile
```

### 4. Start the local blockchain

```bash
npm run node
```

Hardhat starts the local network at:

```text
http://127.0.0.1:8545
```

### 5. Add Hardhat Localhost in MetaMask

Use the following values:

```text
Network Name: Hardhat Localhost
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

### 6. Import test accounts into MetaMask

When you run:

```text
npm run node
```

Hardhat prints multiple local development accounts and their private keys in the terminal.

For this project:

- use `Account #0` as the owner
- use `Account #1` as the nominee

Important:

```text
These are Hardhat test accounts meant only for localhost development.
Never use test private keys on Sepolia, Mainnet, or any public blockchain.
```

### 7. Deploy the contract

Open a new terminal and run:

```bash
npm run deploy:localhost
```

Copy the deployed contract address shown in the terminal.

### 8. Start the frontend

```bash
npm run start:frontend
```

Open:

```text
http://127.0.0.1:8080
```

## Usage

### Save the will

1. Connect MetaMask.
2. Paste the deployed contract address.
3. Use the owner account.
4. Write the will text.
5. Click `Save Will`.
6. Approve the transaction in MetaMask.

### Fetch the will

1. Switch MetaMask to the nominee account.
2. Wait until the release time passes.
3. Click `Fetch Will`.
4. The will text appears on the page.

## Environment Variables

This project runs fully on localhost without a real `.env` file.

An `.env.example` file is included only to make the repository GitHub-ready if you later extend the project for:

- Sepolia deployment
- wallet private key based deployment
- Etherscan verification

Never commit your real `.env` file.

## Screenshots

Add screenshots here before publishing or submitting:

```text
[Screenshot 1: Home Page]
[Screenshot 2: MetaMask Connected]
[Screenshot 3: Successful Save]
[Screenshot 4: Deployment Output]
[Screenshot 5: Successful Fetch]
```

## Future Scope

- Encrypt the will data before storage
- Add support for multiple nominees
- Allow updating nominee and release time
- Deploy to a public Ethereum testnet
- Add automated contract tests
- Store file hashes for document-based wills

## Viva Explanation

This project shows how blockchain can be used for digital inheritance. The `owner` stores the will in a smart contract, and the `nominee` can read it only after a release timestamp. The contract uses `require()` statements for security, `msg.sender` for caller validation, and `block.timestamp` for time-based access control.

## Author

**Your Name**  
Blockchain Developer / Student

You can replace this section with your own name, college, department, and GitHub profile before pushing the repo.
