import { Center, Input, Button, Image } from '@chakra-ui/react';
import { handleLoginWithData } from '../utils/authHandlers';
import { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../client/AuthContext';
import Cookies from 'universal-cookie';
const LoginScreen = () => {
  const cookies = new Cookies();
  const { setUser } = useContext(Context);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const handleForm = async (e) => {
    e.preventDefault();
    const { jwt, username, id, roleName, punkty } = await handleLoginWithData(login, password);
    cookies.set('token', jwt);
    setUser({ username, id, isAdmin: roleName === 'admin', points: punkty, jwt });
  };
  return (
    <Center minH="92vh" display="flex" flexDirection="column">
      <Image src="https://i.imgur.com/9Rqu5ZB.png" alt="MechanikBets" />
      <form action="" onSubmit={(e) => handleForm(e)}>
        <Input my="2" onChange={(e) => setLogin(e.target.value)} type="text" placeholder="username" />
        <Input my="2" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        <Button type="submit">Login</Button>
      </form>
    </Center>
  );
};

export default LoginScreen;
