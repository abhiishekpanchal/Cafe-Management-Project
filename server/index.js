import express from "express";
import mongoose from "mongoose";
import cafeRouter from "./routes/cafe.route.js";
import menuRouter from "./routes/menu.router.js";
import orderRouter from "./routes/order.route.js";
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    })

    const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/server/cafeDetails', cafeRouter);
app.use('/server/menuDetails', menuRouter);
app.use('/server/orderDetails', orderRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})