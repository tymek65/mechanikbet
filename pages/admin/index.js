import Cookies from 'universal-cookie';
import Link from 'next/link';
import { useQuery } from 'react-query';
import axios from 'axios';
import Zaklad from '../../components/Zaklad';
import { Button, Center, Flex, Spinner, Text, useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import Head from 'next/head';
import socket from '../../client/Socket';

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
  if (!cookies.get('token')) {
    return (
      <Flex justifyContent="center" alignItems="center" flexDirection="column" minHeight="95vh">
        <Text>Nie masz dostępu do tej strony</Text>

        <Link href="/">
          <Button>Wróć</Button>
        </Link>
      </Flex>
    );
  }

  if (isLoading)
    return (
      <Center minH="92vh">
        <Spinner size="lg" />
      </Center>
    );
  if (data.role.name !== 'admin') {
    return (
      <Flex justifyContent="center" alignItems="center" flexDirection="column" minHeight="95vh">
        <Text>Nie masz dostępu do tej strony</Text>

        <Link href="/">
          <Button>Wróć</Button>
        </Link>
      </Flex>
    );
  }
  if (zakladyloading) return <p>Loading...</p>;
  return (
    <>
      <Head>
        <title>Admin | mechanikBET</title>
      </Head>
      <Link href="/">
        <Button mx="2" variant="outline">
          Strona główna
        </Button>
      </Link>
      <Link href="admin/dodaj">
        <Button mx="2" variant="outline">
          Dodaj zakład
        </Button>
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
