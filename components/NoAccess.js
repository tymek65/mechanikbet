import { Flex, Text, Button } from '@chakra-ui/react';
import Link from 'next/link';

const NoAccess = () => {
  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column" minHeight="95vh">
      <Text>Nie masz dostępu do tej strony</Text>
      <Link href="/" passHref>
        <Button>Wróć</Button>
      </Link>
    </Flex>
  );
};

export default NoAccess;
