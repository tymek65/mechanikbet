import { Box } from '@chakra-ui/react';
import { MobileNavigation, DesktopNavigation } from './Navigation';
const NavBar = () => {
  const links = [
    { name: 'Strona główna', link: '/' },
    { name: 'Leaderboard', link: '/leaderboard' },
    { name: 'Twoje kupony', link: '/kupony' },
    { name: 'Donate', link: '/donate' },
    { name: 'Admin', link: '/admin', adminAccess: true },
  ];

  return (
    <Box>
      <DesktopNavigation links={links} />
      <MobileNavigation links={links} />
    </Box>
  );
};

export default NavBar;
