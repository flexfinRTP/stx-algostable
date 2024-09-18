import { Box, Flex, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useConnect } from '@stacks/connect-react'

function Header() {
  const { authentication, signOut } = useConnect()
  const [userAddress, setUserAddress] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    if (authentication && authentication.isSignedIn()) {
      setIsSignedIn(true)
      setUserAddress(authentication.stxAddress)
    } else {
      setIsSignedIn(false)
      setUserAddress('')
    }
  }, [authentication])

  const handleSignIn = () => {
    if (typeof window !== 'undefined' && window.LeatherProvider) {
      window.LeatherProvider.request('open')
    } else {
      alert('Please install Leather wallet extension')
    }
  }

  const handleSignOut = () => {
    signOut()
    setIsSignedIn(false)
    setUserAddress('')
  }

  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box bg={bg} borderBottom={1} borderStyle={'solid'} borderColor={borderColor}>
      <Flex maxW="container.xl" mx="auto" alignItems="center" justifyContent="space-between" py={4} px={8}>
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