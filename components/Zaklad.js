import axios from 'axios';
import { useQuery } from 'react-query';
import Cookies from 'universal-cookie';
import { useState, useRef } from 'react';
import { Button, Heading, Text, Box, Flex, Badge } from '@chakra-ui/react';
import BetClosePrompt from './BetClosePrompt';

const Zaklad = ({ zaklady, socket }) => {
  const [option, setOption] = useState(null);
  const [type, setType] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const cookies = new Cookies();
  async function fetchKupony() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/kuponies?zaklady.id=${zaklady.id}&active=true`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
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
      <Box textAlign="center" maxW={['28em']} className="zakladywrap" key={zaklady.id} p="4">
        <Heading isTruncated size="md">
          {zaklady.tekst}
        </Heading>
        <Flex flexDirection="row" className="zakladopcja" alignItems="center" justifyContent="center" m="2">
          <Heading size="md">{zaklady.opcja1}</Heading>
          <Button m="2" colorScheme="green" className="wygrana" size="sm" onClick={() => handleClose('finish', 1)}>
            Wygrana
          </Button>
        </Flex>
        <Flex flexDirection="row" alignItems="center" justifyContent="center" m="2">
          <Heading size="md">{zaklady.opcja2}</Heading>
          <Button m="2" size="sm" colorScheme="green" className="wygrana" onClick={() => handleClose('finish', 2)}>
            Wygrana
          </Button>
        </Flex>
        <Box flexDirection="column">
          <Button m="2" size="sm" colorScheme="red" className="anuluj" onClick={() => handleClose('finish', 'cancel')}>
            Anuluj zakład
          </Button>
          <br />
          {zaklady.betactive == true ? (
            <Button
              size="sm"
              variant="outline"
              className="close"
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
          {data.map((kupon) => (
            <Box p="3" m="2" border="2px" borderRadius="lg" borderColor="grey" w="200px" key={kupon.id} className="kupon" bgColor="whiteAlpha.100">
              <Text>{kupon.user.username}</Text>
              <Text>Kurs - {kupon.kurs}</Text>
              <Text>Typ - {kupon.opcja === 1 ? zaklady.opcja1 : zaklady.opcja2}</Text>
              <Text>Stawka - {kupon.wartosc}</Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </>
  );
};

export default Zaklad;
