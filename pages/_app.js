import '../styles/chakra.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Footer from '../components/Footer';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../utils/theme';
import { Box } from '@chakra-ui/react';
import NavBar from '../components/NavBar';
import { AuthContext } from '../client/AuthContext';
import SocketHandler from '../client/SocketHandler';
function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthContext>
          <SocketHandler>
            <Box m="2" flex={'1 0 auto'}>
              <NavBar />
              <Component {...pageProps} />
            </Box>
            <Footer />
          </SocketHandler>
        </AuthContext>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
