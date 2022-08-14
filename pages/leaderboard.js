import { useQuery } from 'react-query';
import Cookies from 'universal-cookie';
import axios from 'axios';
import NoAccess from '../components/NoAccess';
import { Center, Text, Flex, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import Historia from '../components/historia';
const Leaderboard = () => {
  const cookies = new Cookies();
  async function fetchLeaderboard() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?_sort=punkty:DESC&punkty_gte=0`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
      },
    });
    return data;
  }

  const { isLoading, data } = useQuery('ranking', fetchLeaderboard);
  if (!cookies.get('token')) {
    return <NoAccess />;
  }
  if (isLoading)
    return (
      <Center minH="92vh">
        <Spinner size="lg" />
      </Center>
    );

  return (
    <>
      <Head>
        <title>Leaderboard | mechanikBET</title>
      </Head>

      <Flex justifyContent="center" minH="85vh">
        <Flex px="5" flexDirection="column" justifyContent="center" alignItems="center" className="leaderboard">
          {data.map((user, index) => (
            <Flex bgColor={index % 2 === 0 && 'whiteAlpha.100'} p="1" textAlign="center" key={user.id} width="100%" justifyContent="center">
              <Text mr="1" wordBreak="keep-all">
                {user.username}
              </Text>
              <Text>
                <b>{user.punkty}</b>
              </Text>
            </Flex>
          ))}
        </Flex>

        <Historia />
      </Flex>
    </>
  );
};

export default Leaderboard;
