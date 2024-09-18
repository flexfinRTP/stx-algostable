// setup-script.js
require('dotenv').config();
const { makeContractCall, broadcastTransaction, uintCV, standardPrincipalCV } = require('@stacks/transactions');
const { StacksMainnet, StacksTestnet } = require('@stacks/network');

const network = process.env.STACKS_NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

async function callContract(contractAddress, contractName, functionName, functionArgs) {
  const txOptions = {
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    senderKey: privateKey,
    network,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction(transaction, network);
  console.log(`Called ${contractName}.${functionName}:`, broadcastResponse);
  return broadcastResponse;
}

async function main() {
  // Set initial parameters
  await callContract(process.env.PRICE_ORACLE_ADDRESS, 'price-oracle', 'set-update-interval', [uintCV(3600)]); // 1 hour
  await callContract(process.env.REBASE_CONTROLLER_ADDRESS, 'rebase-controller', 'set-target-price', [uintCV(1000000)]); // $1.00
  await callContract(process.env.REBASE_CONTROLLER_ADDRESS, 'rebase-controller', 'set-rebase-interval', [uintCV(86400)]); // 24 hours
  await callContract(process.env.REBASE_CONTROLLER_ADDRESS, 'rebase-controller', 'set-rebase-window', [uintCV(0), uintCV(3600)]); // 0:00-1:00 UTC
  await callContract(process.env.STAKING_POOL_ADDRESS, 'staking-pool', 'set-rewards-rate', [uintCV(106900)]); // ~1% daily APY

  // Add authorized updaters
  await callContract(process.env.PRICE_ORACLE_ADDRESS, 'price-oracle', 'add-authorized-updater', [standardPrincipalCV(process.env.DEPLOYER_STX_ADDRESS)]);
  
  // Set contract dependencies
  await callContract(process.env.REBASE_CONTROLLER_ADDRESS, 'rebase-controller', 'set-token-contract', [standardPrincipalCV(process.env.LIBRE_TOKEN_ADDRESS)]);
  await callContract(process.env.REBASE_CONTROLLER_ADDRESS, 'rebase-controller', 'set-price-oracle', [standardPrincipalCV(process.env.PRICE_ORACLE_ADDRESS)]);
  await callContract(process.env.STAKING_POOL_ADDRESS, 'staking-pool', 'set-token-contract', [standardPrincipalCV(process.env.LIBRE_TOKEN_ADDRESS)]);
}

main().catch(console.error);