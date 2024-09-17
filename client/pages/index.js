import { useState, useEffect } from 'react'
import { Box, Heading, Text, Stat, StatLabel, StatNumber, StatGroup, VStack, Button } from '@chakra-ui/react'
import Layout from '../components/Layout'
import DepositWithdraw from '../components/DepositWithdraw'
import { fetchDashboardData, fetchUserBalance, fetchRebaseHistory } from '../services/api'

function HomePage() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [dashboardData, setDashboardData] = useState({
    price: 0,
    totalSupply: 0,
    totalStaked: 0
  })
  const [userBalance, setUserBalance] = useState(0)
  const [rebaseHistory, setRebaseHistory] = useState([])

  useEffect(() => {
    checkWalletConnection()
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (isSignedIn && userAddress) {
      loadUserData()
    }
  }, [isSignedIn, userAddress])

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.LeatherProvider) {
      try {
        const response = await window.LeatherProvider.request('getAddresses')
        if (response.result.addresses.length > 0) {
          setIsSignedIn(true)
          setUserAddress(response.result.addresses.find(addr => addr.symbol === 'STX').address)
        }
      } catch (error) {
        console.error('Failed to get addresses:', error)
      }
    }
  }

  const loadDashboardData = async () => {
    const data = await fetchDashboardData()
    setDashboardData(data)
  }

  const loadUserData = async () => {
    const balance = await fetchUserBalance(userAddress)
    setUserBalance(balance)

    const history = await fetchRebaseHistory(userAddress)
    setRebaseHistory(history)
  }

  const handleConnectWallet = async () => {
    if (typeof window !== 'undefined' && window.LeatherProvider) {
      try {
        await window.LeatherProvider.request('open')
        checkWalletConnection()
      } catch (error) {
        console.error('Failed to open Leather:', error)
      }
    } else {
      alert('Please install Leather wallet extension')
    }
  }

  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Welcome to Libre</Heading>
        {!isSignedIn ? (
          <Button onClick={handleConnectWallet}>Connect Leather Wallet</Button>
        ) : (
          <>
            <Text>Connected: {userAddress}</Text>
            <Text>Your Libre Balance: {userBalance}</Text>
          </>
        )}
        <StatGroup>
          <Stat>
            <StatLabel>Current Price</StatLabel>
            <StatNumber>${dashboardData.price.toFixed(2)}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Supply</StatLabel>
            <StatNumber>{dashboardData.totalSupply.toLocaleString()} Libre</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Total Staked</StatLabel>
            <StatNumber>{dashboardData.totalStaked.toLocaleString()} Libre</StatNumber>
          </Stat>
        </StatGroup>
        {isSignedIn && (
          <>
            <DepositWithdraw userAddress={userAddress} />
            <Box>
              <Heading as="h2" size="lg">Rebase History</Heading>
              {rebaseHistory.map((rebase, index) => (
                <Text key={index}>
                  Date: {new Date(rebase.timestamp).toLocaleString()}, 
                  Change: {rebase.change > 0 ? '+' : ''}{rebase.change}%
                </Text>
              ))}
            </Box>
          </>
        )}
      </VStack>
    </Layout>
  )
}

export default HomePage