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
            <Box m="2" minHeight="92vh" className="wrap">
              <NavBar />
              <Component {...pageProps} />
            </Box>
          </SocketHandler>
        </AuthContext>
        <Footer />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
