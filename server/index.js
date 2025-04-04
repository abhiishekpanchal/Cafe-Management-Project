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

const wss = new WebSocketServer({ port: 8080 });

// WebSocket connection handler
wss.on("connection", (ws, req) => {
    console.log('User connected to WebSocket');
    
    const {query} = url.parse(req.url, true);
    const cafeId = query.cafeId;

    if (cafeId) {
        if (!cafeConnections.has(cafeId)) {
            cafeConnections.set(cafeId, new Set());
        }
        cafeConnections.get(cafeId).add(ws);
        
        ws.send(JSON.stringify({
            type: 'connection',
            message: `Connected to cafe ${cafeId}`
        }));
    }

    ws.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            
            if (parsedMessage.type === 'fetchOrders' && parsedMessage.cafeId) {
                updateToCafe(parsedMessage.cafeId, {
                    type: 'fetchOrders'
                });
            }
            
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    });

    ws.on('close', () => {
        if (cafeId && cafeConnections.has(cafeId)) {
            cafeConnections.get(cafeId).delete(ws);
            
            if (cafeConnections.get(cafeId).size === 0) {
                //remove empyt cafe
                cafeConnections.delete(cafeId);
            } 
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
    
    // ping interval to keep connection alive
    const pingInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
        } else {
            clearInterval(pingInterval);
        }
    }, 30000); 
    
    ws.on('close', () => {
        clearInterval(pingInterval);
    });
});

const updateToCafe = (cafeId, data) => {
    if (!cafeConnections.has(cafeId)) {
        return;
    }
    
    const connections = cafeConnections.get(cafeId);
    let sentCount = 0;
    
    connections.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
            sentCount++;
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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
console.log("WebSocket server is running on port 8080");