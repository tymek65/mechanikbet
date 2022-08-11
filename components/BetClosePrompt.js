import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react';

const ChakraPrompt = ({ isOpen, cancelRef, onClose, id, zaklad, option, socket, optiontekst, type }) => {
  const handleClosing = () => {
    if (type === 'finish') {
      if (option !== null) {
        socket.emit('betclose', id, option);
      }
      onClose();
    } else if (type === 'close') {
      socket.emit('closebet', id);
      onClose();
    }
  };
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Potwierdzenie kuponu
          </AlertDialogHeader>

          <AlertDialogBody>
            {type === 'finish'
              ? option !== 'cancel'
                ? `Czy jesteś pewny, że chcesz zamknąć zakład "${zaklad}" z wygraną dla stawiających na "${optiontekst}"?`
                : `Czy jesteś pewny, że chcesz anulować zakład "${zaklad}"`
              : 'Czy na pewno chcesz zablokować możliwość stawiania nowych kuponów na ten zakład?'}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Anuluj
            </Button>
            <Button colorScheme="green" onClick={handleClosing} ml={3}>
              Potwierdź
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default ChakraPrompt;
