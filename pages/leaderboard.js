import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import LeaderboardChart from '../components/LeaderboardChart';
import Ranking from '../components/Ranking';

const Leaderboard = () => {
  return (
    <>
      <Head>
        <title>Leaderboard | mechanikBET</title>
      </Head>

      <Flex justifyContent="center" minH="85vh">
        <Ranking />
        <LeaderboardChart />
      </Flex>
    </>
  );
};

export default Leaderboard;
