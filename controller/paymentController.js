const Payment = require("../models/Payment");

const stripe = require("stripe")(process.env.STRIPE_KEY);

const createCustomer = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      payment_method: req.body.id,
      invoice_settings: {
        default_payment_method: req.body.id,
      },
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.PRICE_KEY }],
      expand: ["latest_invoice.payment_intent"],
    });
    console.log(
      "customer is here",
      customer,
      "subscription is here",
      subscription
    );
    await Payment.findByIdAndUpdate(
      { _id: req.body.userId },
      {
        user_id: subscription.customer,
        subscriptionid: subscription.id,
        paymentStatus: true,
      }
    );

    res.json({
      subscription,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = createCustomer;
