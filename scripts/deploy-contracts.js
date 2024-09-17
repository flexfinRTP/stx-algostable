// scripts/deploy-contracts.js
const { StacksTestnet } = require('@stacks/network');
const { makeContractDeploy } = require('@stacks/transactions');
const fs = require('fs').promises;
const path = require('path');

const network = new StacksTestnet();
const privateKey = process.env.STACKS_PRIVATE_KEY;

async function deployContract(contractName) {
  const contractSource = await fs.readFile(
    path.join(__dirname, `../contracts/${contractName}.clar`),
    'utf8'
  );

  const transaction = await makeContractDeploy({
    contractName,
    codeBody: contractSource,
    senderKey: privateKey,
    network,
  });

  const result = await network.broadcastTransaction(transaction);
  console.log(`${contractName} deployment result:`, result);
  return result;
}

async function main() {
  try {
    await deployContract('flexstx-token');
    await deployContract('staking-pool');
    await deployContract('rebase-controller');
    await deployContract('price-oracle');
    await deployContract('challenge-system');
    console.log('All contracts deployed successfully');
  } catch (error) {
    console.error('Deployment error:', error);
  }
}

main();