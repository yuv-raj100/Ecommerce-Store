const cartModel = require("../models/cartData");


const setCartInfo = async (req,res)=>{
    const productInfo = [];
    const email = req.body.email;
    req.body.cartDetails.map((s)=>{
        const obj = {
            pageData:s.pageData,
            count:s.count,
            size:s.size
        }
        productInfo.push(obj);
        return s;
    })
    const existingUser = await cartModel.findOne({email:email});
    if(existingUser){
        existingUser.product_info=productInfo;
        const flag = await existingUser.save();
    }
    else{
        const result = await cartModel.create({
            email:email,
            product_info:productInfo
        })
    }
    res.status(201).json({});
}

const getCartInfo = async (req,res)=>{
    const email = req.body.email;
    // console.log(req.body);
    // console.log(email);
    const cartInfo = await cartModel.findOne({email : email});
    const result = {
      cartOrders: cartInfo == null ? [] : cartInfo,
    };
    res.status(201).json(result);
}

// addProduct();

module.exports = {getCartInfo,setCartInfo}; 