const {login,register,profile} = require("../controllers/userControllers")
const {sendProductsList,sendProductInfo,homePage} = require("../controllers/productControllers")
const {getCartInfo,setCartInfo} = require("../controllers/cartController")
const {setOrderInfo,getOrderInfo, paymentVerification} = require("../controllers/orderControllers")
const {agentChatHandler} = require("../controllers/agentController")

const router = require('express').Router();

/**
 * @swagger
 * /agent/chat:
 *   post:
 *     summary: Chat with the AI Shopping Agent
 *     tags: [AI Agent]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               history:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Agent response and structured data
 */
router.post("/agent/chat", agentChatHandler);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login",login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User registration
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Registration successful
 */
router.post("/register",register);

/**
 * @swagger
 * /profile:
 *   post:
 *     summary: Get user profile info
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Profile data retrieved
 */
router.post("/profile",profile)

/**
 * @swagger
 * /profile/orderhistory:
 *   post:
 *     summary: Get user order history
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Order history retrieved
 */
router.post("/profile/orderhistory",getOrderInfo)

/**
 * @swagger
 * /home:
 *   get:
 *     summary: Get home page data
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Successfully fetched home page data
 */
router.get("/home",homePage)
/**
 * @swagger
 * /products/{resId}:
 *   get:
 *     summary: Get products in a category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: resId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/products/:resId",sendProductsList)

/**
 * @swagger
 * /products/{resId}/{name}:
 *   get:
 *     summary: Get specific product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: resId
 *         required: true
 *       - in: path
 *         name: name
 *         required: true
 *     responses:
 *       200:
 *         description: Product details
 */
router.get("/products/:resId/:name",sendProductInfo)

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Update cart items
 *     tags: [Cart]
 *     responses:
 *       201:
 *         description: Cart updated
 */
router.post("/cart",setCartInfo);

/**
 * @swagger
 * /cart/get:
 *   post:
 *     summary: Get user cart items
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart retrieved
 */
router.post("/cart/get",getCartInfo);

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Create an order
 *     tags: [Order]
 *     responses:
 *       201:
 *         description: Order created
 */
router.post("/checkout",setOrderInfo)

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Verify payment
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Payment verified
 */
router.post("/payment",paymentVerification)


module.exports = router;