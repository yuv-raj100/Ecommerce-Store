
const productModel = require('../models/productDetails');
const homeModel = require("../models/homePage")

let productList;

const sendProductsList = async (req,res)=>{
    const productList = await productModel.find();
    let category = req.params.resId;
    if(category==="oversized-t-shirt"){
        category="oversized t-shirt";
    }
    const filterProducts = productList.filter((s)=>{
        return category.toLowerCase().includes(s.category_name.toLowerCase());
    })

    res.status(201).json(filterProducts);
    
}

const sendProductInfo = async (req,res)=>{
    productList = await productModel.find();
    console.log(productList);
    const prdtName = req.params.name;
    const prdtInfo = await productModel.findOne({ handle : prdtName });
    res.status(201).json(prdtInfo);
}

const homePage = async (req,res)=>{

    const data = await homeModel.find();
    const arr=data[0];
    console.log(arr.sliders);
    res.status(201).json({homePage:data});
} 



module.exports = {sendProductsList,sendProductInfo,homePage};