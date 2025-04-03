import express from "express";
import mongoose from "mongoose";
import cafeRouter from "./routes/cafe.route.js";
import menuRouter from "./routes/menu.router.js";
import orderRouter from "./routes/order.route.js";
import userRouter from "./routes/user.route.js";
import inventoryRouter from "./routes/inventory.route.js";
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import fileUpload from "express-fileupload";
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';
import url from "url";
dotenv.config();
const cafeConnections = new Map();
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
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles: true, 
    tempFileDir: '/tmp/', 
}));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (wss,req) => {
    console.log('user connected');
    
    const {query} = url.parse(req.url, true);
    const cafeId = query.cafeId;

    if (cafeId) {
        if (!cafeConnections.has(cafeId)) {
            cafeConnections.set(cafeId, new Set());
        }
        cafeConnections.get(cafeId).add(ws);
        
        console.log(`Client joined cafe room: ${cafeId}`);
        
        ws.send(JSON.stringify({
            type: 'connection',
            message: `Connected to cafe ${cafeId}`
        }));
    }

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            console.log('Received message:', parsedMessage);
            
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        
        if (cafeId && cafeConnections.has(cafeId)) {
            cafeConnections.get(cafeId).delete(ws);
            
            if (cafeConnections.get(cafeId).size === 0) {
                cafeConnections.delete(cafeId);
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
})

export const updateToCafe = (cafeId, data) => {
    if (!cafeConnections.has(cafeId)) {
        return;
    }
    
    const connections = cafeConnections.get(cafeId);
    connections.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};


app.use('/server/cafeDetails', cafeRouter);
app.use('/server/menuDetails', menuRouter);
app.use('/server/orderDetails', orderRouter);
app.use('/server/userDetails', userRouter);
app.use('/server/inventoryDetails', inventoryRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
})