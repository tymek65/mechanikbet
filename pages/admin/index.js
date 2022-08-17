import Link from 'next/link';
import { useQuery } from 'react-query';
import axios from 'axios';
import AdminBet from '../../components/AdminBet';
import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import LoadingView from '../../components/LoadingView';
import NoAccess from '../../components/NoAccess';
import { Context } from '../../client/AuthContext';
import { useContext } from 'react';

const Admin = () => {
  const {
    user: { jwt, isAdmin },
  } = useContext(Context);

  const fetchBets = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies?active=true`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return data;
  };
  const { isLoading: betsLoading, data: betsData } = useQuery('activeBets', fetchBets);

  if (!isAdmin) return <NoAccess />;
  if (betsLoading) return <LoadingView />;

  return (
    <>
      <Head>
        <title>Admin | mechanikBET</title>
      </Head>

      <Link href="admin/dodaj" passHref>
        <Box
          m="15"
          fontSize={40}
          fontWeight={'bold'}
          rounded={'full'}
          bg={'#9AE6B4'}
          pos={'absolute'}
          bottom={0}
          right={0}
          width={20}
          height={20}
          d={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          +
        </Box>
      </Link>

      <Flex flexDirection={['column', 'row']} flexWrap={['nowrap', 'wrap']} justifyContent="space-evenly">
        {betsData.length <= 0 && <h4>Brak aktywnych zakładów</h4>}
        {betsData.map((bet) => (
          <AdminBet key={bet.id} bet={bet} />
        ))}
      </Flex>
    </>
  );
};

export default Admin;
