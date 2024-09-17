// server.js
const express = require('express');
const { initRebaseService } = require('./rebase-service');
const { initPriceFeedService } = require('./price-feed-service');
const { initChallengeService } = require('./challenge-service');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize services
initRebaseService();
initPriceFeedService();
initChallengeService();

// API routes
app.get('/api/price', (req, res) => {
  // TODO: Implement price retrieval from oracle
  res.json({ price: 1.00 });
});

app.get('/api/total-supply', (req, res) => {
  // TODO: Implement total supply retrieval from FlexSTX contract
  res.json({ totalSupply: 1000000 });
});

app.get('/api/staking-stats', (req, res) => {
  // TODO: Implement staking stats retrieval from Staking Pool contract
  res.json({ totalStaked: 500000, apy: 10 });
});

app.get('/api/challenges', (req, res) => {
  // TODO: Implement challenge list retrieval from Challenge System contract
  res.json({ challenges: [] });
});

// Start the server
app.listen(port, () => {
  console.log(`FlexSTX backend server running on port ${port}`);
});