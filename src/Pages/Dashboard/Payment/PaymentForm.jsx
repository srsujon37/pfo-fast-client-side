import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "./../../../Hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const [error, setError] = useState("");
  const { user } = useAuth();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });
  if (isPending) {
    return "....loading";
  }
  console.log(parcelInfo);
  const amount = parcelInfo.cost;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (!card) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("Payment Method", paymentMethod);
    }

    // step-2: create payment intent
    const res = await axiosSecure.post("/create-payment-intent", {
      amountInCents,
      parcelId,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded!");
        // step-4 mark parcel paid also create payment history
        const paymentData = {
          parcelId,
          email: user.email,
          transactionId: result.paymentIntent.id,
          // userEmail,
          amount,
          paymentMethod: result.paymentIntent.payment_method_types
          // payment_status: "paid",
          // paid_at_string: new Date().toISOString(),
          // timestamp: new Date(),
        };

        const paymentRes = await axiosSecure.post('/payments', paymentData);
        if (paymentRes.data.insertedId) {
          console.log('Payment successfully ');
        }
      }
    }

    console.log("res from intent", res);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 card w-full max-w-md shadow-xl p-6 bg-base-100"
      >
        <h2 className="card-title mb-4">Pay with Card</h2>
        <CardElement> </CardElement>
        <button
          className="btn btn-primary mt-4 w-full"
          type="submit"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>

        {error && <p className="text-red-400">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
