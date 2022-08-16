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
import { useState, useContext } from 'react';
import { Context } from '../client/AuthContext';

const ChakraPrompt = ({ isOpen, cancelRef, onClose, id, chosenOption, option1, option2, socket }) => {
  const {
    user: { username, id: userID },
  } = useContext(Context);
  const [wartosc, setWartosc] = useState(10);
  const handleBet = () => {
    if (wartosc !== null && wartosc !== '') {
      if (option1 !== null && option2 !== null) {
        socket.emit('bet', {
          opcja: chosenOption.numer,
          zaklad: id,
          wartosc: wartosc,
          username: username,
          id: userID,
          opcja1: option1,
          opcja2: option2,
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
