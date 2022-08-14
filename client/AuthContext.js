import { useState, useEffect, createContext } from 'react';
import Cookies from 'universal-cookie';
export const Context = createContext();
import { handleLoginWithToken } from '../utils/authHandlers';
export const AuthContext = ({ children }) => {
  const cookies = new Cookies();
  const [user, setUser] = useState({
    username: null,
    id: null,
    isAdmin: null,
  });
  useEffect(() => {
    const loginToken = cookies.get('token');
    if (loginToken) {
      handleLoginWithToken(loginToken);
    }
  }, []);
  return <Context.Provider value={user}>{children}</Context.Provider>;
};

export default AuthContext;
