const {login,register,profile} = require("../controllers/userControllers")
const {sendProductsList,sendProductInfo,homePage} = require("../controllers/productControllers")
const {getCartInfo,setCartInfo} = require("../controllers/cartController")
const {setOrderInfo,getOrderInfo} = require("../controllers/orderControllers")

const router = require('express').Router();

router.post("/login",login);
router.post("/register",register);
router.post("/profile",profile)
router.post("/profile/orderhistory",getOrderInfo)
router.get("/home",homePage)
router.get("/products/:resId",sendProductsList)
router.get("/products/:resId/:name",sendProductInfo)
router.post("/home",getCartInfo);
router.post("/cart",setCartInfo);
router.post("/checkout",setOrderInfo)

module.exports = router;