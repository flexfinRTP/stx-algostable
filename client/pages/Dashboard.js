// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { fetchAccountBalance } from '../services/api';

function Dashboard() {
  const { authentication } = useConnect();
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    if (authentication.isSignedIn()) {
      fetchAccountBalance(authentication.stxAddress).then(setBalance);
    }
    // TODO: Fetch price and total supply from backend API
  }, [authentication]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats">
        <div>Your Balance: {balance} FlexSTX</div>
        <div>Current Price: ${price.toFixed(2)}</div>
        <div>Total Supply: {totalSupply} FlexSTX</div>
      </div>
      {/* TODO: Add more dashboard components (e.g., price chart, recent transactions) */}
    </div>
  );
}

export default Dashboard;