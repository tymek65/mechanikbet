import axios from 'axios';
import { useState, useContext } from 'react';
import { Input, Button, Heading, Center, Box, useToast } from '@chakra-ui/react';
import { Context } from '../../client/AuthContext';
import Head from 'next/head';
import NoAccess from '../../components/NoAccess';

const Dodaj = () => {
  const {
    user: { jwt, isAdmin },
  } = useContext(Context);

  const toast = useToast();
  const [nazwa, setNazwa] = useState('');
  const [opcja1, setOpcja1] = useState('');
  const [opcja2, setOpcja2] = useState('');
  const [url, setUrl] = useState(null);
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
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        if (res.status !== 200) {
          toast('Nie udało się dodać zakładu', {
            type: 'error',
            theme: 'dark',
          });
          return;
        }
        toast({
          title: 'Dodano zakład!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setNazwa('');
        setOpcja1('');
        setOpcja2('');
      });
  };

  if (!isAdmin) {
    return <NoAccess />;
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
