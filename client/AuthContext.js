import { useState, useEffect, createContext } from 'react';
import { useToast } from '@chakra-ui/react';
import Cookies from 'universal-cookie';
export const Context = createContext();
import { handleLoginWithToken, handleLoginWithData } from '../utils/authHandlers';
import LoginScreen from '../components/Login';

export const AuthContext = ({ children }) => {
  const toast = useToast();
  const cookies = new Cookies();
  const handleLogout = () => {
    cookies.remove('token');
    setUser({
      jwt: null,
      username: null,
      id: null,
      isAdmin: false,
      points: 0,
    });
  };

  const [user, setUser] = useState({
    jwt: null,
    username: null,
    id: null,
    isAdmin: false,
    points: 0,
  });

  const loginWithToken = async (token) => {
    try {
      const { id, roleName, username, punkty, jwt } = await handleLoginWithToken(token);
      setUser({ id, username, isAdmin: roleName === 'admin', points: punkty, jwt });
    } catch (err) {
      toast({
        title: err,
        isClosable: true,
        status: 'error',
        duration: 5000,
      });
    }
  };
  const loginWithData = async (login, password, e) => {
    e.preventDefault();
    try {
      const { id, roleName, username, punkty, jwt } = await handleLoginWithData(login, password);
      cookies.set('token', jwt);
      setUser({ username, id, isAdmin: roleName === 'admin', points: punkty, jwt });
    } catch (err) {
      toast({
        title: err,
        isClosable: true,
        status: 'error',
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    const loginToken = cookies.get('token');
    if (loginToken) {
      loginWithToken(loginToken);
    }
  }, []);

  return <Context.Provider value={{ user, setUser, handleLogout }}>{user.username ? children : <LoginScreen loginWithData={loginWithData} />}</Context.Provider>;
};

export default AuthContext;
