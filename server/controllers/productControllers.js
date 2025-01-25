
const productModel = require('../models/productDetails');
const homeModel = require("../models/homePage")

let productList;

const sendProductsList = async (req, res) => {
  const productList = await productModel.find();
  let category = req.params.resId;
  let { page, limit, sort } = req.query;
  sort = sort==undefined?"default":sort;
  console.log(sort);
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 6; // Default limit if not provided

  if (category === "oversized-t-shirt") {
    category = "oversized t-shirt";
  }

  // Filter products by category
  const filterProducts = productList.filter((s) => {
    return category.toLowerCase().includes(s.category_name.toLowerCase());
  });

  // Apply sorting logic
  if (sort === "htol") {
    filterProducts.sort((a, b) => b.original_price - a.original_price);
  } else if (sort === "ltoh") {
    filterProducts.sort((a, b) => a.original_price - b.original_price);
  }
  // Default sorting can be kept as the original order or based on another property

  const results = {
    totalItems: filterProducts.length,
    pageNumber: page,
  };

  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;

  const result = filterProducts.slice(startIdx, endIdx);

  results.result = result;

  res.status(200).json(results);
};


const sendProductInfo = async (req,res)=>{
    productList = await productModel.find();
    const prdtName = req.params.name;
    const prdtInfo = await productModel.findOne({ handle : prdtName });
    res.status(201).json(prdtInfo);
}

const homePage = async (req,res)=>{
    const data = await homeModel.find();
    const arr=data[0];
    res.status(201).json({homePage:data});
} 



module.exports = {sendProductsList,sendProductInfo,homePage};