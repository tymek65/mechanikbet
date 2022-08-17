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
  const [betName, setBetName] = useState('');
  const [firstOption, setFirstOption] = useState('');
  const [secondOption, setSecondOption] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const handlesubmit = async (e) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies`,
        {
          tekst: betName,
          opcja1: firstOption,
          opcja2: secondOption,
          zdjecieurl: imageUrl,
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
        setBetName('');
        setFirstOption('');
        setSecondOption('');
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
          <form action="" onSubmit={(e) => handlesubmit(e)}>
            <Input my="2" onChange={(e) => setBetName(e.target.value)} value={betName} type="text" placeholder="nazwa zakładu" />
            <Input my="2" onChange={(e) => setFirstOption(e.target.value)} value={firstOption} type="text" placeholder="opcja1" />
            <Input my="2" onChange={(e) => setSecondOption(e.target.value)} value={secondOption} type="text" placeholder="opcja2" />
            <Input my="2" onChange={(e) => setImageUrl(e.target.value)} value={imageUrl} type="text" placeholder="url do zdjecia" />
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
