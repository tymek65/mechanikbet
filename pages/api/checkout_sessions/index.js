import { CURRENCY, MIN_AMOUNT, MAX_AMOUNT } from "../../../config";
import { formatAmountForStripe } from "../../../utils/stripe-helpers";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export default async function handler(req, res) {
  if (req.method === "POST") {
    // console.log(req.body);
    const amount = req.body.customDonation;
    try {
      // Validate the amount that was passed from the client.
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        console.log(req.body.customDonation);
      }
      // Create Checkout Sessions from body params.
      const params = {
        submit_type: "donate",
        payment_method_types: ["card", "p24"],
        line_items: [
          {
            name: "Custom amount donation",
            amount: formatAmountForStripe(amount, CURRENCY),
            currency: CURRENCY,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/donate`,
      };
      const checkoutSession = await stripe.checkout.sessions.create(params);
      res.redirect(303, checkoutSession.url);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
