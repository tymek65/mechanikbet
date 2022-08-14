import Cookies from 'universal-cookie';
import axios from 'axios';
import SingleKupon from '../components/SingleKupon';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Heading, Checkbox, Box, Flex } from '@chakra-ui/react';
import NoAccess from '../components/NoAccess';
import LoadingView from '../components/LoadingView';

const Kupony = () => {
  const [data, setData] = useState(null);
  const [checkbox, setCheckbox] = useState(false);
  const cookies = new Cookies();
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${cookies.get('token')}`,
        },
      })
      .then((res) => {
        setData(res.data.kuponies.sort((a, b) => b.active - a.active));
      })
      .catch((err) => {
        console.log(err);
      });
    const savedCheckbox = Boolean(localStorage.getItem('checkbox'));
    setCheckbox(savedCheckbox);
  }, []);

  const handleCheckbox = (value) => {
    setCheckbox(value);
    localStorage.setItem('checkbox', value);
  };
  if (!cookies.get('token')) {
    return <NoAccess />;
  }
  if (!data) {
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

          {data.map((kupon) => {
            if (!checkbox && !kupon.active) return;
            return <SingleKupon key={kupon.id} kupon={kupon} />;
          })}
        </Box>
      </Flex>
    </>
  );
};

export default Kupony;
