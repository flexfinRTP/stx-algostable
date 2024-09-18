// server.js
import express from 'express';
import { initRebaseService } from './rebase-service.js';
import { initPriceFeedService } from './price-feed-service.js';
import { initStakingService, getStakedAmount, getRewardsRate } from './staking-service.js';
import { StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction } from '@stacks/transactions';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize services
initRebaseService();
initPriceFeedService();
initStakingService();

const network = new StacksMainnet();
const contractAddress = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';

// API routes
app.get('/api/price', async (req, res) => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'price-oracle',
      functionName: 'get-price',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });
    res.json({ price: result.value.value / 1000000 }); // Convert from 6 decimal places
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

app.get('/api/total-supply', async (req, res) => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName: 'libre',
      functionName: 'get-total-supply',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });
    res.json({ totalSupply: result.value.value / 1000000 }); // Convert from 6 decimal places
  } catch (error) {
    console.error('Error fetching total supply:', error);
    res.status(500).json({ error: 'Failed to fetch total supply' });
  }
});

app.get('/api/staking-stats', async (req, res) => {
  try {
    const totalStaked = await callReadOnlyFunction({
      contractAddress,
      contractName: 'staking-pool',
      functionName: 'get-total-staked',
      functionArgs: [],
      network,
      senderAddress: contractAddress,
    });

    const rewardsRate = await getRewardsRate();
    const annualRewardsRate = (rewardsRate * 365 * 100) / 1000000; // Convert to annual percentage

    res.json({
      totalStaked: totalStaked.value.value / 1000000, // Convert from 6 decimal places
      apy: annualRewardsRate.toFixed(2) // APY as a percentage with 2 decimal places
    });
  } catch (error) {
    console.error('Error fetching staking stats:', error);
    res.status(500).json({ error: 'Failed to fetch staking stats' });
  }
});

app.get('/api/user-staking-info/:address', async (req, res) => {
  try {
    const userAddress = req.params.address;
    const stakedAmount = await getStakedAmount(userAddress);
    const rewardsRate = await getRewardsRate();

    res.json({
      stakedAmount: stakedAmount / 1000000, // Convert from 6 decimal places
      dailyRewardsRate: (rewardsRate * 100) / 1000000 // Daily rewards rate as a percentage
    });
  } catch (error) {
    console.error('Error fetching user staking info:', error);
    res.status(500).json({ error: 'Failed to fetch user staking info' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Libre backend server running on port ${port}`);
});