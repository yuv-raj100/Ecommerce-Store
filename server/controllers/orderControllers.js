const orderModel = require("../models/orderData");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require('../models/paymentModel')



const setOrderInfo = async (req, res) => {
    // console.log("hi");
    
    try {
        const orderId = `#${Math.floor(100000 + Math.random() * 900000)}`;
        const { useremail, product_info, total, email, phone, pincode, address, name, keyId, keySecret} = req.body;

        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        const options = {
          amount: Number(total)*100,
          currency: "INR",
        };

        const response = await razorpay.orders.create(options);
        const {id, amount, currency} = response;
        //console.log(response);

        const order = {
            products: product_info,
            total,
            orderId,
            email,
            phone,
            pincode,
            address,
            name,
            razorpayId:id,
        };

        // Create a base structure for new user
        const newUserOrder = {
            useremail,
            product_info: [order],
        };

        // Check if user already exists in the database
        const existingUser = await orderModel.findOne({ useremail });

        if (existingUser) {
            // If the user exists, append the order to their existing orders
            existingUser.product_info.push(order);
            await existingUser.save();
        } else {
            // If the user doesn't exist, create a new document
            await orderModel.create(newUserOrder);
        }

        // Send the generated order ID in the response
        res.status(201).json({ id, amount, currency, orderId });
    } catch (error) {
        console.error("Error in setOrderInfo:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const paymentVerification = async (req, res) => {
  const {
    razorpay_order_id,
    customerOrderId,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!razorpay_order_id || !customerOrderId || !razorpay_payment_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Generate the expected signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  // Log for debugging
  console.log("Is Payment Authentic:", isAuthentic);

  if (!isAuthentic) {
    // Return an error response if the signature doesn't match
    return res.status(400).json({
      error: "Payment verification failed. Invalid signature.",
    });
  }

  try {
    // Save payment details to the database if the payment is authentic
    const payment = new Payment({
      RazorpayOrderId: razorpay_order_id,
      customerOrderId,
      RazorpayPaymentId: razorpay_payment_id,
      RazorpaySignature: razorpay_signature,
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      message: "Payment verified and details saved successfully",
      paymentDetails: savedPayment,
    });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getOrderInfo = async (req,res)=>{
    const useremail = req.body.email;
    // console.log(req.body);
    // console.log(email);
    const orderInfo = await orderModel.findOne({useremail : useremail});
    const result ={
        orders:orderInfo==null?[]:orderInfo,
    }
    return res.status(201).json(result);
}



module.exports = {setOrderInfo,getOrderInfo,paymentVerification};