import Link from 'next/link';
import { Box, Link as ChakraLink } from '@chakra-ui/react';
const Footer = () => {
  return (
    <Box bgColor="blackAlpha.300" p="4" className="footer">
      <Link href="/pp" passHref>
        <ChakraLink mx={2}>Polityka Prywatności</ChakraLink>
      </Link>
      <Link href="/regulamin" passHref>
        <ChakraLink mx={2}>Regulamin</ChakraLink>
      </Link>
    </Box>
  );
};

export default Footer;
