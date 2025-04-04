import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port : 8080});

let rooms: Map<string, WebSocket[]> = new Map();
let prevShapes: Map<string , string> = new Map();

wss.on('connection' , (socket) => {
    // const url = request.url;
    // if(!url) return;

    // const queryParams = new URLSearchParams(url.split('?')[1]);
    // const token = queryParams.get('token') || "";

    // const userId = checkUser(token);

    // if(!userId) wss.close();

    



    console.log("WebSocket connected");

    socket.on("message" , (data) => {

        const message = JSON.parse(data.toString());
        if(message.type === "join"){
            const roomId = message.roomId;
            if(!rooms.has(roomId)){
                rooms.set(roomId , []);
            }
            if(!prevShapes.has(roomId)){
                prevShapes.set(roomId, message.prevShapes);
            }
            rooms.get(roomId)?.push(socket);
            const sockets = rooms.get(roomId);
            if(sockets){
                sockets.forEach((socket) => {
                    if(socket.readyState === WebSocket.OPEN){
                        socket.send(JSON.stringify(prevShapes.get(roomId)));
                    }
                });
            }
        }

        if(message.type === "leave"){
            const roomId = message.roomId;
            if(!rooms.has(roomId)){
                rooms.set(roomId , []);
            }
            const sockets = rooms.get(roomId);
            if(sockets){
                sockets.forEach((socket) => {
                    if(socket.readyState === WebSocket.OPEN){
                        socket.send(JSON.stringify(message));
                    }
                });
            }
        } else if(message.type === "draw"){
            const roomId = message.roomId;
            console.log(roomId);
            if(!rooms.has(roomId)){
                rooms.set(roomId , []);
            }
            const sockets = rooms.get(roomId);
            if(sockets){
                sockets.forEach((socket) => {
                    if(socket.readyState === WebSocket.OPEN){
                        socket.send(JSON.stringify(message.shapes));
                    }
                });
            }
        }

        
    });

});