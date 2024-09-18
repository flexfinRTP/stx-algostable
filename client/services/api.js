import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: API_URL,
})

export const fetchDashboardData = async () => {
  try {
    const [priceResponse, supplyResponse, stakingResponse] = await Promise.all([
      api.get('/api/price'),
      api.get('/api/total-supply'),
      api.get('/api/staking-stats'),
    ])

    return {
      price: priceResponse.data.price,
      totalSupply: supplyResponse.data.totalSupply,
      totalStaked: stakingResponse.data.totalStaked,
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      price: 0,
      totalSupply: 0,
      totalStaked: 0,
    }
  }
}

export const fetchUserBalance = async (address) => {
  try {
    const response = await api.get(`/api/balance/${address}`)
    return response.data.balance
  } catch (error) {
    console.error('Error fetching user balance:', error)
    return 0
  }
}

export const depositAsset = async (amount, assetType, address) => {
  try {
    const response = await api.post('/api/deposit', { amount, assetType, address })
    return response.data
  } catch (error) {
    console.error('Error depositing asset:', error)
    throw error
  }
}

export const withdrawAsset = async (amount, assetType, address) => {
  try {
    const response = await api.post('/api/withdraw', { amount, assetType, address })
    return response.data
  } catch (error) {
    console.error('Error withdrawing asset:', error)
    throw error
  }
}

export const stake = async (amount, address) => {
  try {
    const response = await api.post('/api/stake', { amount, address })
    return response.data
  } catch (error) {
    console.error('Error staking:', error)
    throw error
  }
}

export const unstake = async (amount, address) => {
  try {
    const response = await api.post('/api/unstake', { amount, address })
    return response.data
  } catch (error) {
    console.error('Error unstaking:', error)
    throw error
  }
}

export const claimRewards = async (address) => {
  try {
    const response = await api.post('/api/claim-rewards', { address })
    return response.data
  } catch (error) {
    console.error('Error claiming rewards:', error)
    throw error
  }
}

export const fetchStakedAmount = async (address) => {
  try {
    const response = await api.get(`/api/staked-amount/${address}`)
    return response.data.stakedAmount
  } catch (error) {
    console.error('Error fetching staked amount:', error)
    return 0
  }
}

export const fetchRewardsRate = async () => {
  try {
    const response = await api.get('/api/rewards-rate')
    return response.data.rewardsRate
  } catch (error) {
    console.error('Error fetching rewards rate:', error)
    return 0
  }
}

export const fetchUserDeposits = async (address) => {
  try {
    const response = await api.get(`/api/deposits/${address}`)
    return response.data.deposits
  } catch (error) {
    console.error('Error fetching user deposits:', error)
    return { STX: 0, sBTC: 0 }
  }
}

export const fetchRebaseHistory = async (address) => {
  try {
    const response = await api.get(`/api/rebase-history/${address}`)
    return response.data.rebaseHistory
  } catch (error) {
    console.error('Error fetching rebase history:', error)
    return []
  }
}

export const fetchPriceHistory = async () => {
  try {
    const response = await api.get('/api/price-history')
    return response.data.priceHistory
  } catch (error) {
    console.error('Error fetching price history:', error)
    return []
  }
}