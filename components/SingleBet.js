import { useState, useEffect, useRef } from 'react';
import Cookies from 'universal-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Text, Flex, Box, Heading, useToast, Spinner } from '@chakra-ui/react';
import ChakraPrompt from './ChakraPrompt';
import socket from '../client/Socket';

const SingleBet = ({ item, setPunkty }) => {
  const toast = useToast();
  const cookies = new Cookies();
  const [option1, setOption1] = useState(null);
  const [option2, setOption2] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [chosenOption, setChosenOption] = useState({
    numer: null,
    opcja: null,
  });
  const handlebetx = (numer, opcja) => {
    if (option1 !== null && option2 !== null) {
      setChosenOption({ numer: numer, opcja: opcja });
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('users', (data) => {
        setUsers(data);
      });
      socket.on('rate', (data) => {
        if (data.bet === item.id) {
          setOption1(data.rate1);
          setOption2(data.rate2);
        }
      });
      socket.on('betsuccessful', (data) => {
        toast({
          title: 'Kupon przyjęty!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      });
      socket.on('betplaceed', (data) => {
        if (data === item.id) {
          setOption1(null);
          setOption2(null);
          socket.emit('request rate', item.id);
        }
      });
      socket.on('points', (data) => {
        setPunkty(data);
      });
      socket.on('notenoughpoints', (data) => {
        toast({
          title: 'Nie masz wystarczająco punktów',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
      socket.on('betnotactive', (data) => {
        toast({
          title: 'Przyjmowanie zakładów nie jest aktywne',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
      socket.emit('request rate', item.id);
    }
    return () => {
      socket.removeAllListeners();
    };
  }, [socket]);

  return (
    <>
      <ChakraPrompt isOpen={isOpen} cancelRef={cancelRef} onClose={onClose} id={item.id} chosenOption={chosenOption} option1={option1} option2={option2} socket={socket} />
      <Box borderColor={item.betactive ? 'grey' : 'red.400'} borderWidth="2px" borderRadius="lg" my="2" maxW="600px" h="150px" display="flex">
        {item.zdjecieurl !== null && (
          <img
            src={item.zdjecieurl}
            alt=""
            style={{
              height: '146px',
              position: 'absolute',
              zIndex: '-1',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0)  )',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1),  rgba(0,0,0,0) )',
            }}
          />
        )}

        <Flex p="4" alignItems="center" justifyContent="space-between">
          <Heading size="sm" wordBreak="break-word" textShadow="0px 0px 14px #000000;">
            {item.tekst}
          </Heading>
          <Flex key={item.id}>
            <Box mx="2" textAlign="center">
              <Text> {item.opcja1}</Text>
              <Button disabled={item.betactive == false || (!cookies.get('token') && true)} onClick={() => handlebetx(1, item.opcja1, item.id)}>
                {option1 === null ? (
                  <Spinner size="sm" />
                ) : Math.round((1.6 + option2 * 0.11 - option1 * 0.08) * 100) / 100 < 1.1 ? (
                  1.1
                ) : (
                  Math.round((1.6 + option2 * 0.11 - option1 * 0.08) * 100) / 100
                )}
              </Button>
            </Box>
            <Box mx="2" textAlign="center">
              <Text>{item.opcja2}</Text>
              <Button disabled={item.betactive == false || (!cookies.get('token') && true)} onClick={() => handlebetx(2, item.opcja2, item.id)}>
                {option2 === null ? (
                  <Spinner size="sm" />
                ) : Math.round((1.6 + option1 * 0.11 - option2 * 0.08) * 100) / 100 < 1.1 ? (
                  1.1
                ) : (
                  Math.round((1.6 + option1 * 0.11 - option2 * 0.08) * 100) / 100
                )}
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default SingleBet;
