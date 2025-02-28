"use client";
import { DrawingCanvas } from "@/app/draw";
import { useEffect, useRef, useState } from "react"
import { Shape } from "@/types/Shape";

interface CanvasProps{
    roomId?: string;
}
type Shapes = "text" | "rect" | "ellipse" | "arrow"

export default function Canvas({ roomId }: CanvasProps){
    const [shape , setShape] = useState<Shapes>("rect");
    const str = localStorage.getItem('prevShapes') || '[]';
    const prevShapes: Shape[]  = JSON.parse(str) || [];
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<DrawingCanvas | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    useEffect(() => {
        if(canvasRef.current){
            drawRef.current = new DrawingCanvas(canvasRef.current, prevShapes);
        }

        if(roomId){
            wsRef.current = new WebSocket(`ws://localhost:8080`);
            wsRef.current.onopen = (socket) => {
                
                const data = {
                type : "join",
                roomId,
                prevShapes: drawRef.current?.getShapes()
                }
                
                wsRef.current?.send(JSON.stringify(data));
            }

            wsRef.current.onmessage = (event) => {
                console.log(event.data);
                const receiveShapes = JSON.parse(event.data);
                drawRef.current?.updateShapes(receiveShapes);
            }

            return () => {
                wsRef.current?.close();
            }
        }

        return () => {
            drawRef.current?.destroy();
        }
    }, [roomId])

    useEffect(() => {
        // Function to send shapes over WebSocket
        
        const sendShapesUpdate = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN && drawRef.current) {
                const shapes = drawRef.current.getShapes();
                const data = {
                    type : "draw",
                    roomId,
                    shapes
                }
                wsRef.current.send(JSON.stringify(data));
            }
        };
        
        // Event listener for shape changes
        const handleShapeChange = () => {
            sendShapesUpdate();
        };
        
        // Add event listener
        window.addEventListener('shapechange', handleShapeChange);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('shapechange', handleShapeChange);
        };
    }, []);

    return<div className="relative overflow-hidden w-screen h-screen">
        <div className="absolute text-black font-[Virgil]">
            <button className="m-1 border border-black" onClick={(e) => {
                    e.preventDefault();
                    drawRef.current?.setShape("text");
                }}>
                    Text
                </button>
            <button className="m-1 border border-black" onClick={(e) => {
                e.preventDefault();
                drawRef.current?.setShape("rect");
            }}>Rectangle</button>
            <button className="m-1 border border-black" onClick={(e) => {
                e.preventDefault();
                drawRef.current?.setShape("ellipse");
            }}>Ellipse</button>
            <button className="m-1 border border-black" onClick={(e) => {
                e.preventDefault();
                drawRef.current?.setShape("arrow");
            }}>Arrow</button>
            <button className="m-1 border border-black" onClick={(e) => {
                e.preventDefault();
                drawRef.current?.setPan(true);
            }}>Pan</button>
            <button className="m-1 border border-black" onClick={(e) => {
                e.preventDefault();
                
            }}>Share</button>
        </div>
        <canvas onMouseDown={(e) => {
            console.log(e);
        }} ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="bg-white"></canvas>
    </div>
}