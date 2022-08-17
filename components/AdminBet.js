import axios from 'axios';
import { useQuery } from 'react-query';
import { useContext, useRef } from 'react';
import { Button, Heading, Text, Box, Flex, Badge, useDisclosure, Grid, GridItem, Accordion, AccordionButton, AccordionIcon, AccordionPanel, AccordionItem } from '@chakra-ui/react';
import socket from '../client/Socket';
import { Context } from '../client/AuthContext';
import Coupon from './Coupon';
import { TextPrompt } from './Prompts';
import { getPromptText } from '../utils/coupons';
import LoadingView from './LoadingView';

const AdminBet = ({ bet }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user: { jwt },
  } = useContext(Context);

  const betOptions = [bet.opcja1, bet.opcja2];
  let chosenOptions = useRef({ type: null, option: null });

  const fetchCoupons = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/kuponies?zaklady.id=${bet.id}&active=true`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return data;
  };
  const { isLoading, data } = useQuery(`allCoupons${bet.id}`, fetchCoupons);

  const handleConfirm = () => {
    if (chosenOptions.current.type === 'finish') {
      socket.emit('betclose', bet.id, chosenOptions.current.option);
    } else {
      socket.emit('closebet', bet.id);
    }
    onClose();
  };
  const handleCloseBet = (type, option) => {
    chosenOptions.current = { type, option };
    onOpen();
  };

  if (isLoading) return <LoadingView />;
  return (
    <Box>
      <TextPrompt header={'Aktualizacja zakładu'} isOpen={isOpen} onCancel={onClose} onConfirm={() => handleConfirm()} text={getPromptText(chosenOptions.current, bet.tekst, betOptions)} />
      <Box textAlign="center" maxW={['28em']} key={bet.id} p="4">
        <Heading isTruncated size="md">
          {bet.tekst}
        </Heading>

        {betOptions.map((option, index) => (
          <Flex key={index} flexDirection="row" alignItems="center" justifyContent="center" m="2">
            <Heading size="md">{option}</Heading>
            <Button m="2" colorScheme="green" size="sm" onClick={() => handleCloseBet('finish', index + 1)}>
              Wygrana
            </Button>
          </Flex>
        ))}

        <Box display={'flex'} alignItems={'center'} flexDirection="column">
          <Button m="2" size="sm" colorScheme="red" onClick={() => handleCloseBet('finish', 'cancel')}>
            Anuluj zakład
          </Button>

          {bet.betactive == true ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleCloseBet('close');
              }}
            >
              Zakończ przyjmowanie zakładów
            </Button>
          ) : (
            <Badge variant="solid">Przyjmowanie zakładów zakończone</Badge>
          )}
        </Box>

        <Accordion mt={2} allowToggle>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1">Pokaż kupony postawione na ten zakład</Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gridGap={3} flexDirection="column" alignItems="center">
                {data.length <= 0 && <Text>Brak kuponów</Text>}
                {data.map((kupon, index) => (
                  <GridItem key={index}>
                    <Coupon couponData={kupon} username={kupon.user.username} />
                  </GridItem>
                ))}
              </Grid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
};

export default AdminBet;
