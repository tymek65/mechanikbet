import { useState } from 'react';
import { formatAmountForDisplay } from '../../utils/stripe-helpers';
import * as config from '../../config';
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, Box, Button } from '@chakra-ui/react';
import Head from 'next/head';
const Donate = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(2);
  const handleInputChange = (val) => setInput(val);
  return (
    <>
      <Head>
        <title>Donate | mechanikBET</title>
      </Head>
      <form className="donateform" action="/api/checkout_sessions" method="POST">
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
          <Button variant="solid" disabled={loading}>
            Donate {formatAmountForDisplay(input, config.CURRENCY)}
          </Button>
        </button>
      </form>
    </>
  );
};

export default Donate;
