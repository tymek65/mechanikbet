import Link from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import Cookies from 'universal-cookie';
const NavBar = () => {
  const router = useRouter();

  const links = [
    { name: 'Strona główna', link: '/' },
    { name: 'Leaderboard', link: '/leaderboard' },
    { name: 'Twoje kupony', link: '/kupony' },
    { name: 'Donate', link: '/donate' },
  ];
  const cookies = new Cookies();
  return (
    <nav>
      {links.map((data, index) => (
        <Link passHref href={data.link} key={index}>
          <ChakraLink px={2} py={1} rounded={'md'} _hover={{ textDecoration: 'none', bg: 'gray.700' }} bg={router.pathname === data.link ? 'gray.700' : ''} m="1">
            <b>{data.name}</b>
          </ChakraLink>
        </Link>
      ))}

      {/* {cookies.get('isAdmin') === 'admin' && (
        <Link passHref href="/admin">
          <ChakraLink px={2} py={1} rounded={'md'} _hover={{ textDecoration: 'none', bg: 'gray.700' }} m="1">
            Admin
          </ChakraLink>
        </Link>
      )} */}
    </nav>
  );
};

export default NavBar;
