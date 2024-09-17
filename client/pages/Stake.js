import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { stake, unstake, claimRewards, fetchStakedAmount, fetchRewardsRate } from '../services/api';
import Layout from "../components/Layout";

function Stake() {
  const { authentication } = useConnect();
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakeInput, setStakeInput] = useState('');
  const [rewardsRate, setRewardsRate] = useState(0);

  useEffect(() => {
    // if (authentication.isSignedIn()) {
      fetchUserStakedAmount();
      fetchCurrentRewardsRate();
    // }
  }, [authentication]);

  const fetchUserStakedAmount = async () => {
    if (authentication.stxAddress) {
      const amount = await fetchStakedAmount(authentication.stxAddress);
      setStakedAmount(amount);
    }
  };

  const fetchCurrentRewardsRate = async () => {
    const rate = await fetchRewardsRate();
    setRewardsRate(rate);
  };

  const handleStake = async () => {
    if (!authentication.isSignedIn()) {
      alert('Please sign in to stake.');
      return;
    }
    try {
      await stake(parseInt(stakeInput), authentication.stxAddress);
      alert('Staking transaction submitted. Please wait for it to be confirmed.');
      await fetchUserStakedAmount();
      setStakeInput('');
    } catch (error) {
      console.error('Staking error:', error);
      alert('Failed to stake. Please try again.');
    }
  };

  const handleUnstake = async () => {
    if (!authentication.isSignedIn()) {
      alert('Please sign in to unstake.');
      return;
    }
    try {
      await unstake(parseInt(stakeInput), authentication.stxAddress);
      alert('Unstaking transaction submitted. Please wait for it to be confirmed.');
      await fetchUserStakedAmount();
      setStakeInput('');
    } catch (error) {
      console.error('Unstaking error:', error);
      alert('Failed to unstake. Please try again.');
    }
  };

  const handleClaimRewards = async () => {
    if (!authentication.isSignedIn()) {
      alert('Please sign in to claim rewards.');
      return;
    }
    try {
      await claimRewards(authentication.stxAddress);
      alert('Claim rewards transaction submitted. Please wait for it to be confirmed.');
      await fetchUserStakedAmount();
    } catch (error) {
      console.error('Claiming rewards error:', error);
      alert('Failed to claim rewards. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="stake">
        <h1>Stake Libre</h1>
        <div>
          <input
            type="number"
            value={stakeInput}
            onChange={(e) => setStakeInput(e.target.value)}
            placeholder="Amount to stake"
          />
                    <div><br /></div>
          <button onClick={handleStake}>Stake</button>
          <div><br /></div>
        </div>
        <div>
          <p>Currently Staked: {stakedAmount} Libre</p>
          <div><br /></div>
          <p>Current Rewards Rate: {rewardsRate}% APY</p>
          <div><br /></div>
          <button onClick={handleUnstake}>Unstake</button>
          <div><br /></div>
          <button onClick={handleClaimRewards}>Claim Rewards</button>
        </div>
      </div>
    </Layout>
  );
}

export default Stake;