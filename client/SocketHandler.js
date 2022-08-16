import socket from './Socket';
import { useToast } from '@chakra-ui/react';
import { useEffect, useContext } from 'react';
import { Context } from './AuthContext';

const SocketHandler = ({ children }) => {
  const { setUser } = useContext(Context);
  const toast = useToast();
  useEffect(() => {
    socket.on('message', ({ text, status }) => {
      toast({
        title: text,
        status: status,
        duration: 5000,
        isClosable: true,
      });
    });
    socket.on('points', (data) => {
      setUser((prev) => ({ ...prev, points: data }));
    });
    return () => {
      socket.off('message');
      socket.off('points');
    };
  }, []);
  return <>{children}</>;
};

export default SocketHandler;
