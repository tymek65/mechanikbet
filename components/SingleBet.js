import { useState, useEffect, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Text, Flex, Box, Heading, Spinner, Image } from '@chakra-ui/react';
import ChakraPrompt from './ChakraPrompt';
import socket from '../client/Socket';

const SingleBet = ({ item }) => {
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const [options, setOptions] = useState([
    { rate: null, name: item.opcja1 },
    { rate: null, name: item.opcja2 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [chosenOption, setChosenOption] = useState({
    numer: null,
    opcja: null,
  });

  const handlebetx = (numer, opcja) => {
    setChosenOption({ numer: numer, opcja: opcja });
    setIsOpen(true);
  };

  useEffect(() => {
    socket.on('rate', ({ bet: betID, rate1, rate2 }) => {
      if (betID === item.id) {
        const rates = [rate1, rate2];
        setOptions((prev) => prev.map((option, index) => ({ ...option, rate: rates[index] })));
      }
    });
    socket.on('betplaceed', (data) => {
      if (data === item.id) {
        setOptions((prev) => prev.map((option) => ({ ...option, rate: null })));
        socket.emit('request rate', item.id);
      }
    });
    socket.emit('request rate', item.id);

    return () => {
      socket.off('rate');
      socket.off('betplaceed');
    };
  }, [item.id]);

  return (
    <>
      <ChakraPrompt isOpen={isOpen} cancelRef={cancelRef} onClose={onClose} id={item.id} chosenOption={chosenOption} option1={options[0].rate} option2={options[1].rate} socket={socket} />
      <Box borderColor={item.betactive ? 'grey' : 'red.400'} borderWidth="2px" borderRadius="lg" my="2" maxW="600px" h="150px" display="flex">
        {item.zdjecieurl && (
          <Image
            src={item.zdjecieurl}
            alt={item.tekst}
            h={146}
            pos={'absolute'}
            zIndex={-1}
            style={{
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
            {options.map((option, index) => (
              <Box key={index} mx="2" textAlign="center">
                <Text> {option.name}</Text>
                <Button disabled={!item.betactive} onClick={() => handlebetx(index + 1, option.name)}>
                  {option.rate ?? <Spinner size="sm" />}
                </Button>
              </Box>
            ))}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default SingleBet;
