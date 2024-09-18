import { Box, Flex } from '@chakra-ui/react'
import Header from './Header'

function Layout({ children }) {
  return (
    <Box>
      <Header />
      <Flex
        as="main"
        direction="column"
        align="center"
        justify="flex-start"
        minH="calc(100vh - 64px)"
        px={[4, 6, 8]}
        py={8}
      >
        {children}
      </Flex>
    </Box>
  )
}

export default Layout