import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Input, Button, Text, useToast } from '@chakra-ui/react';
import { depositAsset, withdrawAsset, fetchUserDeposits } from '../services/api';

function DepositWithdraw({ userAddress }) {
  const [deposits, setDeposits] = useState({ STX: 0, sBTC: 0 });
  const [inputAmount, setInputAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('STX');
  const toast = useToast();

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
      toast({
        title: "Wallet not connected",
        description: "Please connect your Leather wallet to deposit.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await depositAsset(parseFloat(inputAmount), selectedAsset, userAddress);
      toast({
        title: "Deposit successful",
        description: `Successfully deposited ${inputAmount} ${selectedAsset}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setInputAmount('');
      await fetchUserDepositsData();
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit failed",
        description: "Failed to deposit. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleWithdraw = async () => {
    if (!userAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Leather wallet to withdraw.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await withdrawAsset(parseFloat(inputAmount), selectedAsset, userAddress);
      toast({
        title: "Withdrawal successful",
        description: `Successfully withdrew ${inputAmount} ${selectedAsset}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setInputAmount('');
      await fetchUserDepositsData();
    } catch (error) {
      console.error('Withdraw error:', error);
      toast({
        title: "Withdrawal failed",
        description: "Failed to withdraw. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Deposit or Withdraw Assets</Heading>
        <Box>
          <Button colorScheme={selectedAsset === 'STX' ? 'blue' : 'gray'} onClick={() => setSelectedAsset('STX')} mr={2}>
            STX
          </Button>
          <Button colorScheme={selectedAsset === 'sBTC' ? 'blue' : 'gray'} onClick={() => setSelectedAsset('sBTC')}>
            sBTC
          </Button>
        </Box>
        <Input
          type="number"
          value={inputAmount}
          onChange={(e) => setInputAmount(e.target.value)}
          placeholder={`Enter ${selectedAsset} amount`}
        />
        <Button colorScheme="green" onClick={handleDeposit}>Deposit</Button>
        <Button colorScheme="red" onClick={handleWithdraw}>Withdraw</Button>
        <Box>
          <Heading size="sm">Your Deposits</Heading>
          <Text>STX: {deposits.STX}</Text>
          <Text>sBTC: {deposits.sBTC}</Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default DepositWithdraw;