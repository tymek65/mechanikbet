import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import Cookies from 'universal-cookie/es6';

const ChakraPrompt = ({ isOpen, cancelRef, onClose, id, chosenOption, option1, option2, socket }) => {
  const cookies = new Cookies();
  const [wartosc, setWartosc] = useState(10);
  const handleBet = () => {
    if (wartosc !== null && wartosc !== '') {
      if (option1 !== null && option2 !== null) {
        socket.emit('bet', {
          opcja: chosenOption.numer,
          zaklad: id,
          wartosc: wartosc,
          username: cookies.get('username'),
          id: cookies.get('id'),
          opcja1: Math.round((1.6 + option2 * 0.11 - option1 * 0.08) * 100) / 100,
          opcja2: Math.round((1.6 + option1 * 0.11 - option2 * 0.08) * 100) / 100,
        });
      }
    }
    onClose();
  };
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Potwierdzenie kuponu
          </AlertDialogHeader>

          <AlertDialogBody>
            <NumberInput defaultValue={wartosc} min={1} onChange={(val) => setWartosc(val)} step={10}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            Czy jesteś pewny że chcesz postawić {wartosc} punktów na {'"'}
            {chosenOption.opcja}
            {'"'}?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Anuluj
            </Button>
            <Button colorScheme="green" onClick={handleBet} ml={3}>
              Potwierdź
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ChakraPrompt;
