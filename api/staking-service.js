// api/staking-service.js
import { StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction, makeContractCall, uintCV, standardPrincipalCV } from '@stacks/transactions';

const network = new StacksMainnet();
const contractAddress = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
const contractName = 'staking-pool';

export const getStakedAmount = async (address) => {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-staked-amount',
    functionArgs: [standardPrincipalCV(address)],
    network,
    senderAddress: address,
  });
  return result.value.value;
};

export const getRewardsRate = async () => {
  const result = await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-rewards-rate',
    functionArgs: [],
    network,
    senderAddress: contractAddress,
  });
  return result.value.value;
};

export const stakeTokens = async (amount, address) => {
  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'stake',
    functionArgs: [uintCV(amount)],
    senderKey: 'your-private-key', // Be careful with private keys!
    network,
  };
  
  const transaction = await makeContractCall(txOptions);
  return transaction;
};

// Implement similar functions for unstake and claimRewards

export const initStakingService = () => {
  // Initialize any necessary connections or state for the staking service
  console.log('Staking service initialized');
};