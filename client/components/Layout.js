import { Box, Container } from '@chakra-ui/react'
import Header from './Header'

function Layout({ children }) {
  return (
    <Box>
      <Header />
      <Container maxW="container.xl" pt={8}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout