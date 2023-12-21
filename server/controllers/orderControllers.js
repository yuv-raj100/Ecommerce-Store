const orderData = require("../models/orderData");
const orderModel = require("../models/orderData");


const setOrderInfo = async (req,res)=>{
    console.log(req.body)
    const orderId = "#"+ Math.floor(100000 + Math.random() * 900000);;
    const useremail = req.body.useremail;
    const product_info = req.body.product_info;
    const order = {
        products:product_info,
        total:req.body.total,
        orderId:orderId,
        email:req.body.email,
        phone:req.body.phone,
        pincode:req.body.pincode,
        address:req.body.address,
        name:req.body.name,
    }
    const newObj = {
        useremail:useremail,
        product_info : []
    }
    newObj.product_info.push(order);

    // const obj = req.body;
    // obj.orderId = orderId;
    const existingUser = await orderModel.findOne({useremail:useremail});
    if(existingUser){
        console.log(existingUser);

        existingUser.product_info.push(order);
        const flag = await existingUser.save();
    }
    else{
        const result = await orderModel.create(newObj)
    }
    res.status(201).json({orderId:orderId});
}

const getOrderInfo = async (req,res)=>{
    const useremail = req.body.email;
    // console.log(req.body);
    // console.log(email);
    const orderInfo = await orderModel.findOne({useremail : useremail});
    if(orderInfo===null)
        res.status(201).json([]);
    else
        res.status(201).json(orderInfo.product_info);
}



module.exports = {setOrderInfo,getOrderInfo};