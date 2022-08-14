import Cookies from 'universal-cookie';
import Link from 'next/link';
import { useQuery } from 'react-query';
import axios from 'axios';
import Zaklad from '../../components/Zaklad';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import Head from 'next/head';
import socket from '../../client/Socket';
import LoadingView from '../../components/LoadingView';
import NoAccess from '../../components/NoAccess';

const Admin = () => {
  const toast = useToast();
  useEffect(() => {
    if (socket) {
      socket.on('closegit', (data) => {
        toast({
          title: 'Zamknięto zakład!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      });
      socket.on('betresolved', (data) => {
        toast({
          title: 'Zakład został zamknięty i rozliczony!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      });
      socket.on('betnotactive', (data) => {
        toast({
          title: 'Zakład został już rozliczony',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
    }
  }, [socket]);
  const cookies = new Cookies();

  async function fetchProfile() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
      },
    });
    return data;
  }
  const { isLoading, data } = useQuery('profile', fetchProfile);

  async function fetchZaklady() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies?active=true`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
      },
    });
    return data;
  }
  const { isLoading: zakladyloading, data: zakladydata } = useQuery('zaklady', fetchZaklady);

  if (isLoading || zakladyloading) return <LoadingView />;
  if (!cookies.get('token' || data.role.name !== 'admin')) return <NoAccess />;

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
        {zakladydata.length <= 0 && <h4>Brak aktywnych zakładów</h4>}
        {zakladydata.map((zaklad) => (
          <Zaklad socket={socket} key={zaklad.id} zaklady={zaklad} />
        ))}
      </Flex>
    </>
  );
};

export default Admin;
