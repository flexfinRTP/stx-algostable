// rebase-service.js
import { StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';

const REBASE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const BLOCK_POLLING_INTERVAL = 60 * 1000; // 1 minute in milliseconds

let lastProcessedBlock = 0;

async function performRebase() {
  try {
    const network = new StacksMainnet();
    const contractAddress = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
    const contractName = 'rebase-controller';
    const functionName = 'rebase';

    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs: [],
      senderAddress: contractAddress, // This should be the address that's authorized to perform rebases
    });

    console.log('Rebase result:', cvToJSON(result));
  } catch (error) {
    console.error('Error performing rebase:', error);
  }
}

function scheduleNextRebase() {
  const now = Date.now();
  const nextRebaseTime = Math.ceil(now / REBASE_INTERVAL) * REBASE_INTERVAL;
  const delay = nextRebaseTime - now;

  setTimeout(() => {
    performRebase();
    scheduleNextRebase();
  }, delay);

  console.log(`Next rebase scheduled in ${delay / 1000 / 60} minutes`);
}

async function checkNewBlocks() {
  try {
    const network = new StacksMainnet();
    const response = await fetch(`${network.coreApiUrl}/v2/info`);
    const info = await response.json();
    const latestBlock = info.stacks_tip_height;

    if (latestBlock > lastProcessedBlock) {
      console.log('New block received:', latestBlock);
      // TODO: Check if it's time to perform a rebase based on the block height
      lastProcessedBlock = latestBlock;
    }
  } catch (error) {
    console.error('Error checking for new blocks:', error);
  }
}

function initRebaseService() {
  // Set up periodic block checking
  setInterval(checkNewBlocks, BLOCK_POLLING_INTERVAL);

  scheduleNextRebase();
}

export { initRebaseService };