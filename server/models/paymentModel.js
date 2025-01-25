const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    customerOrderId: { type: String, required: true },
    RazorpayOrderId: { type: String, required: true },
    RazorpayPaymentId: { type: String, required: true },
    RazorpaySignature: { type: String, required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
