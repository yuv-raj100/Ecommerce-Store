const mongoose = require('mongoose');


const quantitySchema = new mongoose.Schema({
    size: String,
    count: String
});

const productSchema = new mongoose.Schema({
      product_name: {
        type: String,
        
      },
      id:{
        type: String,
       
      },
      category_name: {
        type: String,
      },
      handle: {
        type: String,
      },
      images: {
        type: [String],
      },
      original_price: {
        type: String,
      },
      exclusive_price: {
        type: String,
      },
      status: {
        type: Boolean,
      },
      color: {
        type: String,
      },
      quantity: [quantitySchema],
      description:{
        type:String
      },
      occasion: {
        type:String
      }
});

const storeSchema = mongoose.Schema({
    pageData : productSchema,
    count : {
        type : String,
        default : 1
    },
    size : String,
})

const orderSchema = mongoose.Schema({
    useremail: {
        type : String,
        required:true
    },
    product_info : [
        {
            products:[storeSchema],
            total: {
              type : String,
              required:true
            },
            orderId: {
              type : String,
              required:true
            },
            email : {
              type : String,
              required:true
            },
            name: {
                type : String,
                required:true
            },
            address: {
                type : String,
                required:true
            },
            pincode: {
                type : String,
                required:true
            },
            phone: {
                type : String,
                required:true
            },
        }
    ],
    
})

module.exports = mongoose.model('orderData', orderSchema);