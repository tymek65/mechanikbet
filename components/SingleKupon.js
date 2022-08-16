import { Text, Box, Badge } from '@chakra-ui/react';
import { getCouponValues, getEstimatedWin } from '../utils/coupons';
const SingleKupon = ({ kupon, username }) => {
  const { wygrany, wartosc, kurs, opcja, zaklady } = kupon;
  const { text, color, variant } = getCouponValues(wygrany, wartosc, kurs);
  const estimatedWin = getEstimatedWin(wartosc, kurs);
  return (
    <Box my="2" p="2" bgColor="whiteAlpha.200" borderColor="grey" borderWidth="2px" borderRadius="lg" maxWidth="300px" className="singleKupon">
      <Text>
        <b>{username ?? zaklady.tekst}</b>
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
        Potencjalna wygrana -<b> {estimatedWin}</b>
      </Text>
      <Badge colorScheme={color} variant={variant}>
        {text}
      </Badge>
    </Box>
  );
};

export default SingleKupon;
