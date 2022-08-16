import axios from 'axios';
import { useQuery } from 'react-query';
import { useState, useRef, useContext } from 'react';
import { Button, Heading, Text, Box, Flex, Badge } from '@chakra-ui/react';
import BetClosePrompt from './BetClosePrompt';
import socket from '../client/Socket';
import { Context } from '../client/AuthContext';
import SingleKupon from './SingleKupon';

const Zaklad = ({ zaklady }) => {
  const {
    user: { jwt },
  } = useContext(Context);
  const [option, setOption] = useState(null);
  const [type, setType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const betOptions = [zaklady.opcja1.toString(), zaklady.opcja2];
  console.log(zaklady.opcja1);
  async function fetchKupony() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/kuponies?zaklady.id=${zaklady.id}&active=true`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return data;
  }
  const { isLoading, data } = useQuery(`kupony${zaklady.id}`, fetchKupony);
  const handleClose = (type, opcja) => {
    if (type === 'finish') {
      setType(type);
      setOption(opcja);
      setIsOpen(true);
    } else if (type === 'close') {
      setType(type);
      setIsOpen(true);
    }
  };
  if (isLoading) return <Text>Loading...</Text>;
  return (
    <>
      <BetClosePrompt
        isOpen={isOpen}
        cancelRef={cancelRef}
        onClose={onClose}
        id={zaklady.id}
        option={option}
        socket={socket}
        zaklad={zaklady.tekst}
        optiontekst={option === 1 ? zaklady.opcja1 : zaklady.opcja2}
        type={type}
      />
      <Box textAlign="center" maxW={['28em']} key={zaklady.id} p="4">
        <Heading isTruncated size="md">
          {zaklady.tekst}
        </Heading>
        {betOptions.map((option, index) => (
          <Flex key={index} flexDirection="row" alignItems="center" justifyContent="center" m="2">
            <Heading size="md">{option}</Heading>
            <Button m="2" colorScheme="green" size="sm" onClick={() => handleClose('finish', index + 1)}>
              Wygrana
            </Button>
          </Flex>
        ))}

        <Box display={'flex'} alignItems={'center'} flexDirection="column">
          <Button m="2" size="sm" colorScheme="red" className="anuluj" onClick={() => handleClose('finish', 'cancel')}>
            Anuluj zakład
          </Button>

          {zaklady.betactive == true ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleClose('close');
              }}
            >
              Zakończ przyjmowanie zakładów
            </Button>
          ) : (
            <Badge variant="solid">Przyjmowanie zakładów zakończone</Badge>
          )}
        </Box>

        <Flex flexDirection="column" alignItems="center">
          {data.length <= 0 && <Text>Brak kuponów</Text>}
          {data.map((kupon, index) => (
            <SingleKupon key={index} kupon={kupon} username={kupon.user.username} />
          ))}
        </Flex>
      </Box>
    </>
  );
};

export default Zaklad;
