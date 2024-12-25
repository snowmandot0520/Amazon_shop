import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./payment.css";
const stripePromise = loadStripe(
  "pk_test_51OANvyCO76SHQfgW6Z1ZhB5dbtx4gaQWTsHQzeTc5N3w2Kb5kUWlGEMFNcMxp2s5gnidXUWEte9PzF0HBep5xHGC00aNwKszrd"
);
// const stripePromise = loadStripe(process.env.publishable_key);
console.log(stripePromise, "stripePromise");
const StripeProvider = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeProvider;
