import { Center, Input, Button, Image } from '@chakra-ui/react';
import { useState } from 'react';

const LoginScreen = ({ loginWithData }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Center minH="92vh" display="flex" flexDirection="column">
      <Image src="https://i.imgur.com/9Rqu5ZB.png" alt="MechanikBets" />
      <form action="" onSubmit={(e) => loginWithData(login, password, e)}>
        <Input my="2" onChange={(e) => setLogin(e.target.value)} type="text" placeholder="username" />
        <Input my="2" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        <Button type="submit">Login</Button>
      </form>
    </Center>
  );
};

export default LoginScreen;
