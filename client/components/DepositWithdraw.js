import React, { useState, useEffect } from 'react';
import { depositAsset, withdrawAsset, fetchUserDeposits } from '../services/api';

function DepositWithdraw({ userAddress }) {
  const [deposits, setDeposits] = useState({ STX: 0, sBTC: 0 });
  const [inputAmount, setInputAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('STX');

  useEffect(() => {
    if (userAddress) {
      fetchUserDepositsData();
    }
  }, [userAddress]);

  const fetchUserDepositsData = async () => {
    if (userAddress) {
      const userDeposits = await fetchUserDeposits(userAddress);
      setDeposits(userDeposits);
    }
  };

  const handleDeposit = async () => {
    if (!userAddress) {
      alert('Please connect your Leather wallet to deposit.');
      return;
    }
    try {
      await depositAsset(parseFloat(inputAmount), selectedAsset, userAddress);
      alert(`Successfully deposited ${inputAmount} ${selectedAsset}`);
      setInputAmount('');
      await fetchUserDepositsData();
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Failed to deposit. Please try again.');
    }
  };

  const handleWithdraw = async () => {
    if (!userAddress) {
      alert('Please connect your Leather wallet to withdraw.');
      return;
    }
    try {
      await withdrawAsset(parseFloat(inputAmount), selectedAsset, userAddress);
      alert(`Successfully withdrew ${inputAmount} ${selectedAsset}`);
      setInputAmount('');
      await fetchUserDepositsData();
    } catch (error) {
      console.error('Withdraw error:', error);
      alert('Failed to withdraw. Please try again.');
    }
  };

  return (
    <div className="deposit-withdraw-container">
      <h2>Deposit or Withdraw Assets</h2>
      <div className="asset-selector">
        <button 
          className={selectedAsset === 'STX' ? 'selected' : ''} 
          onClick={() => setSelectedAsset('STX')}
        >
          STX
        </button>
        <button 
          className={selectedAsset === 'sBTC' ? 'selected' : ''} 
          onClick={() => setSelectedAsset('sBTC')}
        >
          sBTC
        </button>
      </div>
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder={`Enter ${selectedAsset} amount`}
      />
      <div className="action-buttons">
        <button onClick={handleDeposit}>Deposit</button>
        <div><br /></div>
        <button onClick={handleWithdraw}>Withdraw</button>
        <div><br /></div>
      </div>
      <div className="deposits-info">
        <h3>Your Deposits</h3>
        <p>STX: {deposits.STX}</p>
        <p>sBTC: {deposits.sBTC}</p>
      </div>
    </div>
  );
}

export default DepositWithdraw;