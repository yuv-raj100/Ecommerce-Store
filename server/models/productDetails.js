const mongoose = require('mongoose')

const quantitySchema = new mongoose.Schema({
    size: String,
    count: String
});

const productSchema = mongoose.Schema({
      product_name: {
        type: String,
        required: true
      },
      id:{
        type: String,
        required:true
      },
      category_name: {
        type: String,
        required: true
      },
      handle: {
        type: String,
        required: true
      },
      images: {
        type: [String],
        required: true
      },
      original_price: {
        type: String,
        required: true
      },
      exclusive_price: {
        type: String,
        required: true
      },
      status: {
        type: Boolean,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      quantity: [quantitySchema],
      description:{
        type:String
      },
      occasion: {
        type:String
      }
});

module.exports = mongoose.model("productDetails",productSchema);