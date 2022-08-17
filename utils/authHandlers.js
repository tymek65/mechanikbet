import axios from 'axios';

export const handleLoginWithToken = async (loginToken) => {
  const {
    data: {
      id,
      username,
      punkty,
      role: { name: roleName },
    },
  } = await axios
    .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    })
    .catch((err) => {
      throw err.response.data.message[0].messages[0].message;
    });

  return { id, username, punkty, roleName, jwt: loginToken };
};

export const handleLoginWithData = async (login, password) => {
  const {
    data: {
      jwt,
      user: {
        id,
        username,
        punkty,
        role: { name: roleName },
      },
    },
  } = await axios
    .post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`, {
      identifier: login,
      password: password,
    })
    .catch((err) => {
      throw err.response.data.message[0].messages[0].message;
    });
  return { jwt, id, username, punkty, roleName };
};
