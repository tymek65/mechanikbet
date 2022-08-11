import Cookies from 'universal-cookie';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Text, Box, Badge } from '@chakra-ui/react';
const SingleKupon = ({ kupon }) => {
  const cookies = new Cookies();
  async function fetchZakladfromKupon() {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/zakladies?id=${kupon.zaklady.id}`, {
      headers: {
        Authorization: `Bearer ${cookies.get('token')}`,
      },
    });
    return data;
  }
  const { isLoading, data } = useQuery(`singleZaklad${kupon.id}`, fetchZakladfromKupon);
  if (isLoading) return <Text>Loading...</Text>;
  return (
    <Box my="2" p="2" bgColor="whiteAlpha.200" borderColor="grey" borderWidth="2px" borderRadius="lg" maxWidth="300px" className="singleKupon" key={kupon.id}>
      <Text>
        Zakład - <b>{data[0].tekst}</b>
      </Text>
      <Text>
        Twój typ - <b>{kupon.opcja === 1 ? data[0].opcja1 : data[0].opcja2}</b>
      </Text>
      <Text>
        Kurs - <b>{kupon.kurs}</b>
      </Text>
      <Text>
        Wartość - <b>{kupon.wartosc}</b>
      </Text>
      <Text>
        Potencjalna wygrana -<b> {Math.round(kupon.wartosc * kupon.kurs * 100) / 100}</b>
      </Text>

      <Badge colorScheme={data[0].active === true ? 'gray' : kupon.wygrany === true ? 'green' : 'red'} variant={data[0].active === true ? 'outline' : 'solid'}>
        {data[0].active === true ? 'Kupon w grze' : kupon.wygrany === true ? 'Wygrany' + ` +${kupon.wartosc * kupon.kurs}` : 'Przegrany' + ` -${kupon.wartosc}`}
      </Badge>
    </Box>
  );
};

export default SingleKupon;
