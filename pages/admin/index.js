import Link from 'next/link';
import { useQuery } from 'react-query';
import axios from 'axios';
import AdminBet from '../../components/AdminBet';
import { Flex, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
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
        <IconButton size={'lg'} bg={'green.200'} color={'gray.700'} pos={'fixed'} bottom={10} right={10} _hover={{ color: 'gray.200', bg: 'gray.700' }} icon={<AddIcon />} />
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
