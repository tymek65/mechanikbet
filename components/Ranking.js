import { Flex, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from 'react-query';
import LoadingView from './LoadingView';
import { useContext } from 'react';
import { Context } from '../client/AuthContext';

const Ranking = () => {
  const {
    user: { jwt },
  } = useContext(Context);
  const fetchLeaderboard = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users?_sort=punkty:DESC&punkty_gte=0`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return data;
  };

  const { isLoading, data } = useQuery('ranking', fetchLeaderboard);
  if (isLoading) return <LoadingView />;
  return (
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
  );
};

export default Ranking;
