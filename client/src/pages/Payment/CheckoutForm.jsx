// CheckoutForm.js

import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";

import { BASE_URL } from "../../constant";
import { getUserDetails } from "../../redux/reducers/authSlice";
import { Button } from "antd";

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  if (!elements || !stripe) {
    return;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      console.error(error);
    } else {
      const paymentMethodID = {
        id: paymentMethod.id,
        userId: localStorage.getItem("userId") || "",
      };

      axios
        .post(`/api/create-subscription`, paymentMethodID)
        .then((res) => {
          let subscriptionData = res.data;
          dispatch(getUserDetails());
          navigate("/product");
        })
        .catch((err) => {});
    }
  };

  return (
    <div className="relative h-full">
      <div className="wrapper w-full h-full py-12 sm:py-8 flex items-center justify-center">
        <div className="wrapper w-5/6 sm:w-3/4 md:w-3/5 xl:w-2/5 container py-16 px-8 sm:px-12 bg-white relative">
          <h1 className="title text-xl sm:text-2xl lg:text-3xl font-bold text-very-dark-blue mb-12">
            使用料金を支払い、許可を受けてください。
          </h1>
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="flex flex-wrap justify-between w-full"
          >
            <CardElement
              id="payment-element"
              className="relative w-full mb-2 py-3 text-lg"
            />
            <Button
              htmlType="submit"
              disabled={!stripe}
              className="primary h-[40px] w-full  mb-2"
            >
              Pay
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
