import { Text, Box, Badge } from '@chakra-ui/react';
import { getCouponValues, getEstimatedWin } from '../utils/coupons';
const Coupon = ({ couponData, username }) => {
  const { wygrany: isWon, wartosc: value, kurs: odds, opcja: chosenOption, zaklady: betData } = couponData;
  const { text, color, variant } = getCouponValues(isWon, value, odds);
  const estimatedWin = getEstimatedWin(value, odds);
  return (
    <Box my="2" p="2" bgColor="whiteAlpha.200" borderColor="grey" borderWidth="2px" borderRadius="lg" maxWidth="300px">
      <Text>
        <b>{username ?? betData.tekst}</b>
      </Text>
      <Text>
        Kurs - <b>{odds}</b>
      </Text>
      <Text>
        Twój typ - <b>{chosenOption === 1 ? betData.opcja1 : betData.opcja2}</b>
      </Text>
      <Text>
        Wartość - <b>{value}</b>
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

export default Coupon;
