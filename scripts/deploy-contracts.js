// deploy-contracts.js
require('dotenv').config();
const { makeContractDeploy, broadcastTransaction, AnchorMode } = require('@stacks/transactions');
const { StacksMainnet, StacksTestnet } = require('@stacks/network');
const fs = require('fs');

const network = process.env.STACKS_NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

async function deployContract(contractName, filePath) {
  const codeBody = fs.readFileSync(filePath).toString();
  
  const txOptions = {
    contractName,
    codeBody,
    senderKey: privateKey,
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractDeploy(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  console.log(`Deployed ${contractName}:`, broadcastResponse);
  return broadcastResponse;
}

async function main() {
  const contracts = [
    { name: 'libre', file: './contracts/libre.clar' },
    { name: 'price-oracle', file: './contracts/price-oracle.clar' },
    { name: 'rebase-controller', file: './contracts/rebase-controller.clar' },
    { name: 'staking-pool', file: './contracts/staking-pool.clar' },
  ];

  for (const contract of contracts) {
    await deployContract(contract.name, contract.file);
  }
}

main().catch(console.error);