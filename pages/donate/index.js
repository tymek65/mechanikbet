import { useState } from 'react';
import { formatAmountForDisplay } from '../../utils/stripe-helpers';
import * as config from '../../config';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Button } from '@chakra-ui/react';
import Head from 'next/head';
const Donate = () => {
  const [input, setInput] = useState(2);
  const handleInputChange = (val) => setInput(val);
  return (
    <>
      <Head>
        <title>Donate | mechanikBET</title>
      </Head>

      <form style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} action="/api/checkout_sessions" method="POST">
        <Slider
          width={['90%', '80%', '50%']}
          name="customDonation"
          defaultValue={config.MIN_AMOUNT}
          min={config.MIN_AMOUNT}
          max={config.MAX_AMOUNT}
          step={config.AMOUNT_STEP}
          onChange={(val) => handleInputChange(val)}
          value={input}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={6} />
        </Slider>
        <button type="submit">
          <Button variant="solid">Donate {formatAmountForDisplay(input, config.CURRENCY)}</Button>
        </button>
      </form>
    </>
  );
};

export default Donate;
