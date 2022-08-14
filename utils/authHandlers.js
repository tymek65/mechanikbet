import axios from 'axios';

export const handleLoginWithToken = async (loginToken) => {
  const {
    data: {
      id,
      username,
      role: { name },
    },
  } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
  });
  return { id, username, name };
};

export const handleLoginWithData = (login, password) => {
  const {
    data: {
      response: { data: userData },
    },
  } = axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`, {
    identifier: login,
    password: password,
  });
  return userData;
};
