const { GoogleGenerativeAI } = require("@google/generative-ai");
const productModel = require("../models/productDetails");
const cartModel = require("../models/cartData");

// Initialize Gemini
// Note: You must add GEMINI_API_KEY to your server/.env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_KEY_HERE");

// Define the tools (functions) the AI can use
const tools = [
  {
    functionDeclarations: [
      {
        name: "searchProducts",
        description: "Search for products in the store based on user query, category, or price. Call this when a user asks to see products, is looking for something specific, or wants recommendations.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "General search keyword, e.g., 'sneakers', 'shirt', 'dress', 'red'. Leave empty if not specified.",
            },
            category: {
              type: "STRING",
              description: "Category if specified, typically 'MEN', 'WOMEN', or 'KIDS'.",
            },
            maxPrice: {
              type: "NUMBER",
              description: "Maximum price if the user mentions a budget.",
            }
          },
        },
      },
      {
        name: "addToCart",
        description: "Add a specific product to the user's shopping cart. Use this when the user explicitly asks to buy or add an item to their cart.",
        parameters: {
          type: "OBJECT",
          properties: {
            productName: {
              type: "STRING",
              description: "The exact name of the product to add to the cart.",
            },
            size: {
              type: "STRING",
              description: "The size of the product (e.g., S, M, L, XL). Defaults to M if not specified.",
            },
            quantity: {
              type: "NUMBER",
              description: "The number of items to add. Defaults to 1.",
            }
          },
          required: ["productName"]
        }
      }
    ],
  },
];

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  tools: tools,
  systemInstruction: "You are the NEXGEN Shopping Assistant. You help users find products, answer questions about the store, and help with orders. Be friendly and concise. We ONLY sell the following categories: hoddie, sweatshirt, cargo, and oversized t-shirt. If a user asks for a product outside these categories, or if your product search returns zero products, politely inform them that we don't have that product. Use your tools to search for products when asked. If they ask to add something to their cart, use the addToCart tool.",
});

// Helper function to execute local tools
async function handleToolCall(functionCall, email) {
  if (functionCall.name === "searchProducts") {
    const { query, category, maxPrice } = functionCall.args;
    
    // Build MongoDB query
    let dbQuery = {};
    
    if (query) {
      dbQuery.$or = [
        { product_name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { color: { $regex: query, $options: "i" } }
      ];
    }

    console.log("dbQuery",query);
    
    if (category) {
      dbQuery.category_name = { $regex: category, $options: "i" };
    }
    
    let products = await productModel.find(dbQuery).limit(5); // Limit to 5 for chat UI

    // Filter by price if needed (since price is a string in the model, we filter after querying)
    if (maxPrice) {
      products = products.filter(p => parseFloat(p.exclusive_price) <= maxPrice);
    }

    // Return only necessary data to save tokens
    const simpleProducts = products.map(p => ({
      id: p.id,
      name: p.product_name,
      price: p.exclusive_price,
      color: p.color,
      category: p.category_name,
      handle: p.handle,
      images: p.images ? p.images[0] : null
    }));

    return { 
      products: simpleProducts, 
      message: simpleProducts.length > 0 ? `Found ${simpleProducts.length} products.` : "No products found matching those criteria."
    };
  }

  if (functionCall.name === "addToCart") {
    if (!email) {
      return { success: false, message: "User is not logged in. Please tell the user they need to log in to add items to their cart." };
    }

    const { productName, size, quantity } = functionCall.args;
    
    // Find the product in DB
    const product = await productModel.findOne({ product_name: { $regex: productName, $options: "i" } });
    if (!product) {
      return { success: false, message: `Could not find a product named ${productName}.` };
    }

    const selectedSize = size || "M";
    const selectedQuantity = quantity || 1;

    // Create the cart item object
    const cartItem = {
      pageData: product,
      count: selectedQuantity.toString(),
      size: selectedSize
    };

    // Find user's cart
    const existingCart = await cartModel.findOne({ email: email });
    let productInfo = [];
    
    if (existingCart) {
      productInfo = [...existingCart.product_info];
      // Check if item already exists with same size
      const existingItemIndex = productInfo.findIndex(
        item => item.pageData && item.pageData.id === product.id && item.size === selectedSize
      );

      if (existingItemIndex > -1) {
        productInfo[existingItemIndex].count = (parseInt(productInfo[existingItemIndex].count) + selectedQuantity).toString();
      } else {
        productInfo.push(cartItem);
      }
      
      await cartModel.findOneAndUpdate(
        { email: email },
        { $set: { product_info: productInfo } },
        { new: true }
      );
    } else {
      await cartModel.create({
        email: email,
        product_info: [cartItem]
      });
    }

    return { 
      success: true, 
      message: `Successfully added ${selectedQuantity}x ${product.product_name} (Size: ${selectedSize}) to the cart.`,
      addedItem: cartItem // We pass this back so the frontend can update Redux
    };
  }
  
  return { error: "Function not found" };
}

const agentChatHandler = async (req, res) => {
  try {
    let { message, history, email } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured on the server." });
    }

    // Ensure history is a valid array and follows Gemini's requirements
    let sanitizedHistory = [];
    if (Array.isArray(history) && history.length > 0) {
      // Gemini requires history to start with 'user' role
      // We also filter out any invalid or empty entries
      const validHistory = history.filter(item => item && item.role && item.parts);
      if (validHistory.length > 0 && validHistory[0].role === 'user') {
        sanitizedHistory = validHistory;
      }
    }

    // Start a chat session with the sanitized history
    const chat = model.startChat({
      history: sanitizedHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // Send the user's message
    const result = await chat.sendMessage(message);
    const response = result.response;

    console.log("Response:",response);
    
    let finalMessage = response.text();
    let suggestedProducts = null;
    let addedToCart = null;

    // Check if the AI decided to call a function
    const functionCalls = response.functionCalls();
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0]; // Handle the first tool call
      
      // Execute the local function (query DB)
      const functionResponse = await handleToolCall(call, email);
      console.log("Function Response:",functionResponse)

      // If products were found, we attach them to send to the frontend UI
      if (call.name === "searchProducts" && functionResponse.products) {
          suggestedProducts = functionResponse.products;
      }

      // If an item was added to the cart, send it back so Redux can update
      if (call.name === "addToCart" && functionResponse.addedItem) {
          addedToCart = functionResponse.addedItem;
      }

      // Send the result back to Gemini so it can summarize the findings to the user
      const secondResult = await chat.sendMessage([{
        functionResponse: {
          name: call.name,
          response: functionResponse
        }
      }]);
      
      console.log("Final Response:",secondResult.response.text())
      finalMessage = secondResult.response.text();
    }

    // Return the agent's text and any structured data (like products)
    res.status(200).json({
      text: finalMessage,
      products: suggestedProducts,
      addedToCart: addedToCart
    });

  } catch (error) {
    console.error("Agent Error:", error);
    
    // Handle Google Generative AI rate limit/quota errors (429)
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      return res.status(200).json({ 
        text: "Please try again in 1 minute. I am receiving too many requests.",
        products: null
      });
    }

    res.status(500).json({ error: "An error occurred while communicating with the agent." });
  }
};

module.exports = { agentChatHandler };
