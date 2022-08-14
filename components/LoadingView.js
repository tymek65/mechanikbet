import { Center, Spinner } from '@chakra-ui/react';

const LoadingView = () => {
  return (
    <Center minH="92vh">
      <Spinner size="lg" />
    </Center>
  );
};

export default LoadingView;
