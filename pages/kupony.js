import Cookies from 'universal-cookie';
import Link from 'next/link';
import axios from 'axios';
import SingleKupon from '../components/SingleKupon';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Heading, Checkbox, Box, Center, Spinner, Flex } from '@chakra-ui/react';
const Kupony = () => {
  const [data, setData] = useState(null);
  const [old, setOld] = useState(null);
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
        setData(res.data.kuponies.filter((kupon) => kupon.active === true));
        setOld(res.data.kuponies.filter((kupon) => kupon.active === false));
      })
      .catch((err) => {
        console.log(err);
      });
    if (localStorage.getItem('checkbox')) {
      localStorage.getItem('checkbox') === 'true' ? setCheckbox(true) : setCheckbox(false);
    }
  }, []);
  const handleCheckbox = (value) => {
    setCheckbox(value);
    localStorage.setItem('checkbox', value);
  };
  if (!cookies.get('token')) {
    return (
      <div>
        <p>Nie masz dostępu do tej strony</p>
        <Link href="/">
          <Button>Wróć</Button>
        </Link>
      </div>
    );
  }
  if (data === null || old === null) {
    return (
      <Center minH="92vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Kupony | mechanikBET</title>
      </Head>
      <Flex flexDirection={['column', 'row']}>
        <Box>
          <Link href="/">
            <Button variant="outline">Strona główna</Button>
          </Link>
          <Heading my="3" size="md">
            Kupony
          </Heading>
          <Box>
            <Checkbox onChange={(e) => handleCheckbox(e.target.checked)} isChecked={checkbox}>
              Pokazuj zakończone zakłady
            </Checkbox>
          </Box>

          {data.map((kupon) => (
            <SingleKupon key={kupon.id} kupon={kupon} />
          ))}

          {checkbox === true && old.map((kupon) => <SingleKupon key={kupon.id} kupon={kupon} />)}
        </Box>
      </Flex>
    </>
  );
};

export default Kupony;
