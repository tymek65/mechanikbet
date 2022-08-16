import { useState, useEffect, createContext } from 'react';
import Cookies from 'universal-cookie';
export const Context = createContext();
import { handleLoginWithToken } from '../utils/authHandlers';
import LoginScreen from '../components/Login';

export const AuthContext = ({ children }) => {
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

  useEffect(() => {
    const loginWithToken = async (token) => {
      const { id, roleName, username, punkty, jwt } = await handleLoginWithToken(token);
      setUser({ id, username, isAdmin: roleName === 'admin', points: punkty, jwt });
    };
    const loginToken = cookies.get('token');
    if (loginToken) {
      loginWithToken(loginToken);
    }
  }, []);

  return <Context.Provider value={{ user, setUser, handleLogout }}>{user.username ? children : <LoginScreen />}</Context.Provider>;
};

export default AuthContext;
