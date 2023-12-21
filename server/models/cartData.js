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

const cartSchema = mongoose.Schema({
    email : {
        type : String,
        required:true
    },
    product_info : [
        {
            pageData : productSchema,
            count : {
                type : String,
                default : 1
            },
            size : String
        }
    ]
})

module.exports = mongoose.model('CartData', cartSchema);