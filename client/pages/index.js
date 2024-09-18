import { useState, useEffect } from 'react'
import { Box, VStack, Heading, Text, Stat, StatLabel, StatNumber, StatGroup, Button, useColorModeValue } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import DepositWithdraw from '../components/DepositWithdraw'
import { fetchDashboardData, fetchUserBalance, fetchRebaseHistory, fetchPriceHistory } from '../services/api'

// Dynamically import the Chart component with SSR disabled
const Chart = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false })

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
  const [priceHistory, setPriceHistory] = useState([])

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  useEffect(() => {
    checkWalletConnection()
    loadDashboardData()
    loadPriceHistory()
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

  const loadPriceHistory = async () => {
    const history = await fetchPriceHistory()
    setPriceHistory(history)
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

  const chartData = {
    labels: priceHistory.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Libre Price',
        data: priceHistory.map(item => item.price),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price'
        }
      }
    }
  }

  return (
    <Layout>
      <VStack spacing={8} align="stretch" bg={bgColor} p={8} borderRadius="lg" boxShadow="xl">
        <Heading as="h1" size="xl">Libre Dashboard</Heading>
        {!isSignedIn ? (
          <Button colorScheme="blue" onClick={handleConnectWallet}>Connect Leather Wallet</Button>
        ) : (
          <>
            <Text>Connected: {userAddress}</Text>
            <Text fontWeight="bold">Your Libre Balance: {userBalance.toFixed(2)} Libre</Text>
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
        <Box borderWidth={1} borderColor={borderColor} p={4} borderRadius="md">
          <Heading as="h2" size="md" mb={4}>Price History</Heading>
          {typeof window !== 'undefined' && <Chart data={chartData} options={chartOptions} />}
        </Box>
        {isSignedIn && (
          <>
            <DepositWithdraw userAddress={userAddress} />
            <Box borderWidth={1} borderColor={borderColor} p={4} borderRadius="md">
              <Heading as="h2" size="md" mb={4}>Rebase History</Heading>
              {rebaseHistory.map((rebase, index) => (
                <Text key={index}>
                  Date: {new Date(rebase.timestamp).toLocaleString()}, 
                  Change: {rebase.change > 0 ? '+' : ''}{rebase.change.toFixed(2)}%
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