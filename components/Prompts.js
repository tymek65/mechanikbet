import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState } from 'react';

const BasePrompt = ({ children, isOpen, onCancel, header, onConfirm }) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={onCancel}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {header}
          </AlertDialogHeader>

          <AlertDialogBody>{children}</AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onCancel}>Anuluj</Button>
            <Button colorScheme="green" onClick={onConfirm} ml={3}>
              Potwierdź
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export const NumberPrompt = ({ isOpen, onConfirm, onCancel, header, text }) => {
  const [value, setValue] = useState(10);
  const finalText = typeof text === 'string' ? text : text(value);
  return (
    <BasePrompt header={header} isOpen={isOpen} onConfirm={() => onConfirm(value)} onCancel={onCancel}>
      <NumberInput defaultValue={value} min={1} onChange={(val) => setValue(val)} step={10}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {finalText}
    </BasePrompt>
  );
};

export const TextPrompt = ({ header, text, isOpen, onConfirm, onCancel }) => {
  return (
    <BasePrompt header={header} isOpen={isOpen} onConfirm={onConfirm} onCancel={onCancel}>
      {text}
    </BasePrompt>
  );
};
