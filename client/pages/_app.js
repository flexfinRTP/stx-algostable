import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Connect } from '@stacks/connect-react'
import { AppConfig, UserSession } from '@stacks/auth'
import '../styles/globals.css'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e5e2ff',
      100: '#b8b0ff',
      200: '#8a7eff',
      300: '#5c4cff',
      400: '#2e1aff',
      500: '#1500e6',
      600: '#1000b4',
      700: '#0b0082',
      800: '#060050',
      900: '#020020',
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Connect
        authOptions={{
          appDetails: {
            name: 'Libre',
            icon: '/logo.png',
          },
          redirectTo: '/',
          userSession,
          onFinish: () => {
            window.location.reload();
          },
        }}
      >
        <Component {...pageProps} />
      </Connect>
    </ChakraProvider>
  )
}

export default MyApp