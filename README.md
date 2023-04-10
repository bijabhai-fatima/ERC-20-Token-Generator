# ERC-20-Token-Generator
This is a smart contract that generates ERC-20 tokens. It has been tested and deployed using the Hardhat framework on the Sapolia testnet.
## Requirements
- Node.js
- Hardhat
- @nomiclabs/hardhat-ethers
- @nomiclabs/hardhat-waffle
- chai

## Installation
1.Clone the repository:
```
git clone https://github.com/your-username/erc20-token-generator.git
```
2.Navigate to the repository:
```
cd erc20-token-generator
```
3.Install the required packages:
```
npm install
```
## Usage
1.Start Hardhat node:
```
npx hardhat node
```
2.Deploy the contract on the Sapolia testnet:
```
npx hardhat run --network sapolia scripts/deploy.js
```
3.Use the generated contract address to interact with the contract on the Sapolia testnet 
## Testing 
The tests for this smart contract are written using chai and can be found in the test directory. To run the tests, use the command:
```
npx hardhat test

```


