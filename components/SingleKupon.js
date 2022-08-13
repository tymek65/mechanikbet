import { Text, Box, Badge } from '@chakra-ui/react';
import { getCouponValues } from '../utils/coupons';
const SingleKupon = ({ kupon }) => {
  const { wygrany, wartosc, kurs, opcja, zaklady } = kupon;
  const { text, color, variant } = getCouponValues(wygrany, wartosc, kurs);
  return (
    <Box my="2" p="2" bgColor="whiteAlpha.200" borderColor="grey" borderWidth="2px" borderRadius="lg" maxWidth="300px" className="singleKupon">
      <Text>
        <b>{zaklady.tekst}</b>
      </Text>
      <Text>
        Kurs - <b>{kurs}</b>
      </Text>
      <Text>
        Twój typ - <b>{opcja === 1 ? zaklady.opcja1 : zaklady.opcja2}</b>
      </Text>
      <Text>
        Wartość - <b>{wartosc}</b>
      </Text>
      <Text>
        Potencjalna wygrana -<b> {Math.round(wartosc * kurs * 100) / 100}</b>
      </Text>
      <Badge colorScheme={color} variant={variant}>
        {text}
      </Badge>
    </Box>
  );
};

export default SingleKupon;
