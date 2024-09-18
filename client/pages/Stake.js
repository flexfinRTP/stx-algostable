import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Input, Button, Text, Stat, StatLabel, StatNumber, useToast } from '@chakra-ui/react';
import { useConnect } from '@stacks/connect-react';
import { stake, unstake, claimRewards, fetchStakedAmount, fetchRewardsRate } from '../services/api';
import Layout from "../components/Layout";

function Stake() {
  const { authentication } = useConnect();
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakeInput, setStakeInput] = useState('');
  const [rewardsRate, setRewardsRate] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (authentication.isSignedIn()) {
      fetchUserStakedAmount();
      fetchCurrentRewardsRate();
    }
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
      toast({
        title: "Not signed in",
        description: "Please sign in to stake.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await stake(parseInt(stakeInput), authentication.stxAddress);
      toast({
        title: "Staking transaction submitted",
        description: "Please wait for it to be confirmed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchUserStakedAmount();
      setStakeInput('');
    } catch (error) {
      console.error('Staking error:', error);
      toast({
        title: "Staking failed",
        description: "Failed to stake. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUnstake = async () => {
    if (!authentication.isSignedIn()) {
      toast({
        title: "Not signed in",
        description: "Please sign in to unstake.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await unstake(parseInt(stakeInput), authentication.stxAddress);
      toast({
        title: "Unstaking transaction submitted",
        description: "Please wait for it to be confirmed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchUserStakedAmount();
      setStakeInput('');
    } catch (error) {
      console.error('Unstaking error:', error);
      toast({
        title: "Unstaking failed",
        description: "Failed to unstake. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClaimRewards = async () => {
    if (!authentication.isSignedIn()) {
      toast({
        title: "Not signed in",
        description: "Please sign in to claim rewards.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await claimRewards(authentication.stxAddress);
      toast({
        title: "Claim rewards transaction submitted",
        description: "Please wait for it to be confirmed.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchUserStakedAmount();
    } catch (error) {
      console.error('Claiming rewards error:', error);
      toast({
        title: "Claiming rewards failed",
        description: "Failed to claim rewards. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <Box maxWidth="container.md" margin="auto" mt={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl">Stake Libre</Heading>
          <Box>
            <Input
              type="number"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.value)}
              placeholder="Amount to stake"
            />
            <Button colorScheme="blue" onClick={handleStake} mt={4}>Stake</Button>
          </Box>
          <Stat>
            <StatLabel>Currently Staked</StatLabel>
            <StatNumber>{stakedAmount} Libre</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Current Rewards Rate</StatLabel>
            <StatNumber>{rewardsRate}% APY</StatNumber>
          </Stat>
          <Button colorScheme="green" onClick={handleUnstake}>Unstake</Button>
          <Button colorScheme="purple" onClick={handleClaimRewards}>Claim Rewards</Button>
        </VStack>
      </Box>
    </Layout>
  );
}

export default Stake;