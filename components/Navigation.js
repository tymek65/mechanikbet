import { Box, Link as ChakraLink, Drawer, DrawerBody, DrawerContent, DrawerCloseButton, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useContext } from 'react';
import { Context } from '../client/AuthContext';

const Links = ({ links }) => {
  const {
    user: { isAdmin },
  } = useContext(Context);
  const router = useRouter();
  return (
    <>
      {links.map((data, index) => (
        <Link passHref href={data.link} key={index}>
          <ChakraLink
            display={!data.adminAccess || isAdmin ? 'block' : 'none'}
            px={2}
            py={1}
            rounded={'md'}
            _hover={{ textDecoration: 'none', bg: 'gray.600' }}
            bg={router.pathname === data.link ? 'gray.600' : ''}
            m="1"
          >
            <b>{data.name}</b>
          </ChakraLink>
        </Link>
      ))}
    </>
  );
};
export const DesktopNavigation = ({ links: linksData }) => {
  return (
    <Box display={['none', 'flex']} style={{ padding: '10px 0' }}>
      <Links links={linksData} />
    </Box>
  );
};
export const MobileNavigation = ({ links: linksData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <HamburgerIcon w={10} h={9} display={['block', 'none']} onClick={onOpen} />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} style={{ padding: '10px 0' }}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody w={'90%'} display={'flex'} flexDirection={'column'}>
            <Links links={linksData} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};
