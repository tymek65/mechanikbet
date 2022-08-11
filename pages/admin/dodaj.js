import Cookies from 'universal-cookie';
import { useQuery } from 'react-query';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { Input, Button, Text, Heading, Center, Box, Flex, useToast } from '@chakra-ui/react';
import Head from 'next/head';
const Dodaj = () => {
  const toast = useToast();
  const [nazwa, setNazwa] = useState('');
  const [opcja1, setOpcja1] = useState('');
  const [opcja2, setOpcja2] = useState('');
  const [url, setUrl] = useState(null);
  const cookies = new Cookies();
  const handlesubmit = async (e) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies`,
        {
          tekst: nazwa,
          opcja1: opcja1,
          opcja2: opcja2,
          zdjecieurl: url,
        },
        {
          headers: {
            Authorization: 'Bearer ' + cookies.get('token'),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: 'Dodano zakład!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setNazwa('');
          setOpcja1('');
          setOpcja2('');
        } else {
          toast('Nie udało się dodać zakładu', {
            type: 'error',
            theme: 'dark',
          });
        }
      });
  };
  async function fetchProfile() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
      },
    });
    return data;
  }
  const { isLoading, data } = useQuery('profilex', fetchProfile);
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

  if (isLoading) return <Text>Loading...</Text>;
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
  return (
    <>
      <Head>
        <title>Dodaj zakład | mechanikBET</title>
      </Head>
      <Center minH="92vh">
        <Box>
          <Heading>Dodaj zakład</Heading>
          <form action="" className="login-form" onSubmit={(e) => handlesubmit(e)}>
            <Input my="2" onChange={(e) => setNazwa(e.target.value)} value={nazwa} type="text" name="" id="" placeholder="nazwa zakładu" />
            <Input my="2" onChange={(e) => setOpcja1(e.target.value)} value={opcja1} type="text" name="" id="" placeholder="opcja1" />
            <Input my="2" onChange={(e) => setOpcja2(e.target.value)} value={opcja2} type="text" name="" id="" placeholder="opcja2" />
            <Input my="2" onChange={(e) => setUrl(e.target.value)} value={url} type="text" name="" id="" placeholder="url do zdjecia" />
            <Button colorScheme="green" type="submit">
              Dodaj
            </Button>
          </form>
        </Box>
      </Center>
    </>
  );
};

export default Dodaj;
