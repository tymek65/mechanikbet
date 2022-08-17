import axios from 'axios';
import Coupon from '../components/Coupon';
import { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import { Heading, Checkbox, Box, Flex } from '@chakra-ui/react';
import LoadingView from '../components/LoadingView';
import { Context } from '../client/AuthContext';
import { useQuery } from 'react-query';
const Kupony = () => {
  const [checkbox, setCheckbox] = useState(false);
  const {
    user: { jwt },
  } = useContext(Context);

  const { isLoading: isUserBetsLoading, data: userBetsData } = useQuery('userBets', async () => {
    const {
      data: { kuponies },
    } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return kuponies;
  });

  useEffect(() => {
    const savedCheckbox = Boolean(localStorage.getItem('checkbox'));
    setCheckbox(savedCheckbox);
  }, []);

  const handleCheckbox = (value) => {
    setCheckbox(value);
    localStorage.setItem('checkbox', value);
  };

  if (isUserBetsLoading) {
    return <LoadingView />;
  }

  return (
    <>
      <Head>
        <title>Kupony | mechanikBET</title>
      </Head>
      <Flex flexDirection={['column', 'row']}>
        <Box>
          <Heading my="3" size="md">
            Kupony
          </Heading>
          <Box>
            <Checkbox onChange={(e) => handleCheckbox(e.target.checked)} isChecked={checkbox}>
              Pokazuj zakończone zakłady
            </Checkbox>
          </Box>
          {userBetsData
            .sort((a, b) => b.active - a.active || b.id - a.id)
            .map((kupon) => {
              if (!checkbox && !kupon.active) return;
              return <Coupon key={kupon.id} couponData={kupon} />;
            })}
        </Box>
      </Flex>
    </>
  );
};

export default Kupony;
