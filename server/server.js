const express = require('express');
const app = express();
const cors = require('cors');
const addProduct = require("./controllers/cartController")


const connectDB = require("./db/connect")
require('dotenv').config();
const mainRouter = require("./routes/route")
const PORT = process.env.PORT || 3000;
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



