// server.js
import express from 'express';
import { initRebaseService } from './rebase-service.js';
import { initPriceFeedService } from './price-feed-service.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Initialize services
initRebaseService();
initPriceFeedService();

// API routes
app.get('/api/price', (req, res) => {
  // TODO: Implement price retrieval from oracle
  res.json({ price: 1.00 });
});

app.get('/api/total-supply', (req, res) => {
  // TODO: Implement total supply retrieval from algostable contract
  res.json({ totalSupply: 1000000 });
});

app.get('/api/staking-stats', (req, res) => {
  // TODO: Implement staking stats retrieval from Staking Pool contract
  res.json({ totalStaked: 500000, apy: 10 });
});


// Start the server
app.listen(port, () => {
  console.log(` 🚀 Libre backend server running on port ${port} `);
});