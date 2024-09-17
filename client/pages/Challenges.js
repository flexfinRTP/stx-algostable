// pages/Challenges.js
import React, { useState, useEffect } from 'react';
import { useConnect } from '@stacks/connect-react';
import { fetchChallenges, createChallenge } from '../services/api';

function Challenges() {
  const { authentication } = useConnect();
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState({ contract: '', function: '' });

  useEffect(() => {
    fetchChallenges().then(setChallenges);
  }, []);

  const handleCreateChallenge = async () => {
    if (!authentication.isSignedIn()) {
      alert('Please sign in to create a challenge.');
      return;
    }
    try {
      await createChallenge(newChallenge.contract, newChallenge.function);
      // TODO: Update UI after successful challenge creation
    } catch (error) {
      console.error('Challenge creation error:', error);
      alert('Failed to create challenge. Please try again.');
    }
  };

  return (
    <div className="challenges">
      <h1>Challenges</h1>
      <div>
        <input
          type="text"
          value={newChallenge.contract}
          onChange={(e) => setNewChallenge({ ...newChallenge, contract: e.target.value })}
          placeholder="Contract address"
        />
        <input
          type="text"
          value={newChallenge.function}
          onChange={(e) => setNewChallenge({ ...newChallenge, function: e.target.value })}
          placeholder="Function name"
        />
        <button onClick={handleCreateChallenge}>Create Challenge</button>
      </div>
      <div>
        <h2>Active Challenges</h2>
        {challenges.map((challenge) => (
          <div key={challenge.id}>
            <p>Contract: {challenge.contract}</p>
            <p>Function: {challenge.function}</p>
            <p>Status: {challenge.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Challenges;