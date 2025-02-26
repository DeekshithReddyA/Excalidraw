import { WebSocketServer } from "ws";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "@repo/be-common/config";

const wss = new WebSocketServer({port : 8080});

wss.on('connection' , (socket, request) => {
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";

    const decoded = jwt.verify(token , JWT_SECRET as string);

    if(typeof decoded === "string"){
        socket.close();
        return;
    }


    console.log("WebSocket connected");

    socket.on("message" , (data) => {
        socket.send('pong');
    });

});