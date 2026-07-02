const express = require('express');
const app = express();
const cors = require('cors');
const addProduct = require("./controllers/cartController")
const connectDB = require("./db/connect")
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const mainRouter = require("./routes/route")
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NEXGEN Ecommerce API',
            version: '1.0.0',
            description: 'API documentation for NEXGEN Ecommerce Store',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`,
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors({
    allowedHeaders: ['Content-Type'],
}));

app.use("/api",mainRouter)

app.get("/",(req,res)=>{
    res.send("Hello");
})



const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT,()=>(console.log(`server is running on port ${PORT} and connected to DB`)));
    } catch (error) {
        console.log(error);
    } 
}

start();



