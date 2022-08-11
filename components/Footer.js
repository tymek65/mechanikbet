import Link from 'next/link';
import { Box, Link as ChakraLink } from '@chakra-ui/react';
const Footer = () => {
  return (
    <Box bgColor="blackAlpha.300" p="4" className="footer">
      <ChakraLink mx="2">
        <Link href="pp">Polityka Prywatności</Link>
      </ChakraLink>

      <ChakraLink mx="2">
        <Link href="regulamin">Regulamin</Link>
      </ChakraLink>
    </Box>
  );
};

export default Footer;
