// price-feed-service.js
import axios from 'axios';
import { StacksMainnet } from '@stacks/network';
import { callReadOnlyFunction, cvToJSON } from '@stacks/transactions';

const PRICE_UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

async function fetchPrice() {
  try {
    // TODO: Implement actual price fetching from a reliable source
    const response = await axios.get('https://api.example.com/libre-price');
    return response.data.price;
  } catch (error) {
    console.error('Error fetching price:', error);
    return null;
  }
}

async function updatePrice() {
  const price = await fetchPrice();
  if (price !== null) {
    try {
      const network = new StacksMainnet();
      const contractAddress = 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9';
      const contractName = 'price-oracle';
      const functionName = 'update-price';
      const functionArgs = [price]; // Adjust this based on your contract's requirements

      const result = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderAddress: contractAddress, // This should be the address that's authorized to update the price
      });

      console.log('Price update result:', cvToJSON(result));
    } catch (error) {
      console.error('Error updating price on-chain:', error);
    }
  }
}

function initPriceFeedService() {
  // Schedule regular price updates
  setInterval(updatePrice, PRICE_UPDATE_INTERVAL);
}

export { initPriceFeedService };