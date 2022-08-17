import axios from 'axios';
import { useContext } from 'react';
import { Input, Button, Heading, Center, Box, useToast } from '@chakra-ui/react';
import { Context } from '../../client/AuthContext';
import Head from 'next/head';
import NoAccess from '../../components/NoAccess';
import { useReducer } from 'react';
import { formReducer, INITIAL_STATE } from '../../components/FormReducer';
const Dodaj = () => {
  const {
    user: { jwt, isAdmin },
  } = useContext(Context);

  const toast = useToast();
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies`,
        {
          tekst: state.betName,
          opcja1: state.firstOption,
          opcja2: state.secondOption,
          zdjecieurl: state.imageUrl,
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
        dispatch({ type: 'CLEAR_FORM' });
      });
  };
  const handleChange = (e) => {
    dispatch({
      type: 'UPDATE_FORM',
      data: { name: e.target.name, value: e.target.value },
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
          <form action="" onSubmit={handleSubmit}>
            <Input my="2" name="betName" onChange={handleChange} type="text" placeholder="nazwa zakładu" />
            <Input my="2" name="firstOption" onChange={handleChange} type="text" placeholder="opcja1" />
            <Input my="2" name="secondOption" onChange={handleChange} type="text" placeholder="opcja2" />
            <Input my="2" name="imageUrl" onChange={handleChange} type="text" placeholder="url do zdjecia" />
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
