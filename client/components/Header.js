import { Box, Flex, Button, Heading, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userAddress, setUserAddress] = useState('')

  useEffect(() => {
    checkWalletConnection()
  }, [])

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

  const handleSignIn = async () => {
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

  const handleSignOut = () => {
    setIsSignedIn(false)
    setUserAddress('')
    // Note: Leather doesn't have a built-in sign-out method. 
    // This just clears the state in your app.
  }

  return (
    <Box bg="gray.100" py={4}>
      <Flex maxW="container.xl" mx="auto" alignItems="center" justifyContent="space-between">
        <Heading as="h1" size="lg">
        Libre
        </Heading>
        <Flex alignItems="center">
          <Link href="/" passHref>
            <Button as="a" variant="ghost" mr={2}>Home</Button>
          </Link>
          <Link href="/stake" passHref>
            <Button as="a" variant="ghost" mr={2}>Stake</Button>
          </Link>
          {isSignedIn ? (
            <>
              <Text mr={2}>{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</Text>
              <Button onClick={handleSignOut}>Disconnect</Button>
            </>
          ) : (
            <Button onClick={handleSignIn}>Connect Leather Wallet</Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header