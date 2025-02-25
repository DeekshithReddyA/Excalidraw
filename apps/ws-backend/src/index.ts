import { WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});

wss.on('connection' , (socket) => {
    console.log("WebSocket connected");
    socket.on("message" , (data) => {
        socket.send('pong');
    });
    
});