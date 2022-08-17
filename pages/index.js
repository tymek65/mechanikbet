import Head from 'next/head';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useContext } from 'react';
import Bet from '../components/Bet';
import { Button, Badge, Flex, Grid, Avatar, Heading, Text, Box } from '@chakra-ui/react';
import Coupon from '../components/Coupon';
import { Context } from '../client/AuthContext';

export default function Home() {
  const {
    user: { username, points, jwt },
    handleLogout,
  } = useContext(Context);

  const { isLoading, data } = useQuery('activeBets', async () => {
    return ({ data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies?active=true`));
  });

  const { isLoading: isUserBetsLoading, data: userBetsData } = useQuery('userBets', async () => {
    const {
      data: { kuponies },
    } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return kuponies;
  });

  return (
    <>
      <Head>
        <title>mechanikBET</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Badge display={['initial', 'initial', 'none']}>PUNKTY - {points > 0 ? points : `${points} :(`}</Badge>

      <Grid display={['block', 'block', 'grid']} templateColumns={['', '', '1fr auto 1fr']} columnGap={4} templateAreas="'left center right'">
        <Flex gridArea="center" flexDirection="column" alignItems="center">
          {!isLoading && data.length <= 0 && <h4>Brak aktywnych zakładów</h4>}
          {!isLoading && data.map((item) => <Bet key={item.id} item={item} />)}
        </Flex>
        <Flex display={['none', 'none', 'flex']} gridArea="right" direction="column" alignItems={'flex-start'}>
          <Flex alignItems="center" mb={1}>
            <Avatar bg="whiteAlpha.200" mr="1" />
            <Heading size="md">{username}</Heading>
          </Flex>
          <Badge fontSize="sm" my={1}>
            PUNKTY - {points}
          </Badge>

          {!isUserBetsLoading && (
            <>
              {userBetsData.length > 0 && <Text>Ostatnie zakłady</Text>}
              {userBetsData
                .filter((bet) => !bet.active)
                .reverse()
                .slice(0, 3)
                .map((bet, index) => (
                  <Box w="100%" key={index} my={1}>
                    <Coupon couponData={bet} />
                  </Box>
                ))}
            </>
          )}

          <Button mt={1} onClick={() => handleLogout()}>
            Wyloguj
          </Button>
        </Flex>
      </Grid>
    </>
  );
}
