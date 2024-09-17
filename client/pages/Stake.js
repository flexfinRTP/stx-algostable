// pages/Stake.js
import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { callContract } from '../services/contract';

function Stake() {
  const { authentication } = useConnect();
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakeInput, setStakeInput] = useState('');
  const [rewardsRate, setRewardsRate] = useState(0);

  useEffect(() => {
    if (authentication.isSignedIn()) {
      // TODO: Fetch user's staked amount and current rewards rate
    }
  }, [authentication]);

  const handleStake = async () => {
    if (!authentication.isSignedIn()) {
      alert('Please sign in to stake.');
      return;
    }
    try {
      await callContract('staking-pool', 'stake', [stakeInput]);
      // TODO: Update UI after successful stake
    } catch (error) {
      console.error('Staking error:', error);
      alert('Failed to stake. Please try again.');
    }
  };

  const handleUnstake = async () => {
    // TODO: Implement unstaking logic
  };

  const handleClaimRewards = async () => {
    // TODO: Implement rewards claiming logic
  };

  return (
    <div className="stake">
      <h1>Stake FlexSTX</h1>
      <div>
        <input
          type="number"
          value={stakeInput}
          onChange={(e) => setStakeInput(e.target.value)}
          placeholder="Amount to stake"
        />
        <button onClick={handleStake}>Stake</button>
      </div>
      <div>
        <p>Currently Staked: {stakedAmount} FlexSTX</p>
        <p>Current Rewards Rate: {rewardsRate}% APY</p>
        <button onClick={handleUnstake}>Unstake</button>
        <button onClick={handleClaimRewards}>Claim Rewards</button>
      </div>
    </div>
  );
}

export default Stake;