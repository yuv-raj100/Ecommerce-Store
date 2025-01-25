import { useEffect, useRef, useState } from 'react';
import crypto from 'crypto-js';
import PropTypes from 'prop-types';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearItem } from './reducers/CartSlice';


// Function to load script and append in DOM tree.
const loadScript = src => new Promise((resolve) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => {
    console.log('razorpay loaded successfully');
    resolve(true);
  };
  script.onerror = () => {
    console.log('error in loading razorpay');
    resolve(false);
  };
  document.body.appendChild(script);
});


const RenderRazorpay = ({
  orderId,
  keyId,
  keySecret,
  currency,
  amount,
  setScreen,
  customerOrderId,
  setDisplayRazorpay,
}) => {
  
  const [paymentId, setPaymentId] = useState('');
  const [paymentStatus ,setPaymentStatus] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(orderId)

  // To load razorpay checkout modal script.
  const displayRazorpay = async (options) => {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js',
    );

    if (!res) {
      console.log('Razorpay SDK failed to load. Are you online?');
      return;
    }
    const rzp1 = new window.Razorpay(options);

    rzp1.open();
  };


  const handlePayment = async (paymentId, razorpay_signature) => {
    const data=await Axios.post(`${process.env.REACT_APP_SERVER_URL}/payment`,
      {
        razorpay_order_id: orderId, customerOrderId, razorpay_payment_id: paymentId, razorpay_signature
      });
      console.log(data);
  };


  const options = {
    key: keyId,
    amount, 
    currency, 
    name: "NexGen", 
    order_id: orderId, 
    handler: async (response) => {
      console.log("succeeded");
   
      setPaymentId(response.razorpay_payment_id);
      setPaymentStatus(true);
      setScreen(true);
      localStorage.removeItem('cart');
      dispatch(clearItem());
      await handlePayment(response.razorpay_payment_id, response.razorpay_signature);
    //   console.log("updated");

    },
    modal: {
      confirm_close: true, 
      ondismiss: async (reason) => {
        const {
          reason: paymentReason,
          field,
          step,
          code,
        } = reason && reason.error ? reason.error : {};
        if (reason === undefined) {
            setDisplayRazorpay(false);
        }
      },
    },
    retry: {
      enabled: false,
    },
    timeout: 900, // Time limit in Seconds
    theme: {
      color: "", // Custom color for your checkout modal.
    },
  };

  useEffect(() => {
    console.log('in razorpay');
    displayRazorpay(options);
  }, []);

  return (
    <div>
      {paymentStatus && (
        <div className="flex flex-col justify-center mt-10 items-center">
          <h1 className="text-green-600 font-bold mb-2 text-xl">
            Your order is successful...
          </h1>
          <br />
          <h2 className="font-semibold mb-1 text-lg">Order Id: {customerOrderId}</h2>
          <br />
          <h2 className="font-semibold mb-1 text-lg">Payment Id: {paymentId}</h2>

          {setTimeout(() => {
            navigate("/");
          }, 3000)}
        </div>
      )}
    </div>
  );
};

export default RenderRazorpay;