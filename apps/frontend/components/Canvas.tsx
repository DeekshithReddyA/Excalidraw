"use client";
import { DrawingCanvas } from "@/app/draw";
import { useEffect, useRef, useState } from "react"
import { Shape } from "@/types/Shape";
import Navbar from "./Navbar";
import { ShareModal } from "./ShareModal";

interface CanvasProps{
    roomId?: string;
}
type Shapes = "text" | "rect" | "ellipse" | "arrow" | "";

export default function Canvas({ roomId }: CanvasProps){
    const [name , setName ]  = useState("");
    const [link , setLink] = useState("");
    let temp;
    if(roomId !== undefined) temp = true;
    else temp = false;
    const [liveCollab , setLiveCollab] = useState<boolean>(temp);
    const [modalOpen , setModalOpen] = useState<boolean>(false); 
    const [darkMode , setDarkMode ] = useState<boolean>(false);
    const [shape , setShape] = useState<Shapes>("rect");
    const [pan , setPan] = useState<boolean>(false);
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

        const sendClearCanvas = () => {
            drawRef.current?.clearCanvas();
        }

        const handleClearCanvas = () => {
            sendClearCanvas();
        }
        
        // Add event listener
        window.addEventListener('shapechange', handleShapeChange);
        window.addEventListener('clearcanvas' , handleClearCanvas);
        
        // Clean up event listener
        return () => {
            window.removeEventListener('shapechange', handleShapeChange);
            window.addEventListener('clearcanvas' , handleClearCanvas);
        };
    }, []);


    useEffect(() => {
        drawRef.current?.setShape(shape);
    }, [shape]);

    useEffect(() => {
        drawRef.current?.setPan(pan);
    }, [pan]);
    
    useEffect(() => {
        if(darkMode)
        drawRef.current?.setStrokeColor("dark");
        else drawRef.current?.setStrokeColor("light");
    }, [darkMode]);

    useEffect(() => {
        if(liveCollab) {
            const generatedLink = crypto.randomUUID();
            setLink(generatedLink);
        }
    },[liveCollab])

    return<div className="relative overflow-hidden w-screen">
        {modalOpen && <ShareModal link={link} liveCollab={liveCollab} setLiveCollab={setLiveCollab} setModalOpen={setModalOpen} name={name} setName={setName} darkMode={darkMode}/>}
        <div className="absolute md:right-5 md:top-5 right-2 top-5 text-black">
            <div onClick={(e) => {
                e.preventDefault();
                console.log(liveCollab);
                setModalOpen(true);
            }} className={`${darkMode ? `${liveCollab ? "bg-green-500" : "bg-violet-400"} text-black` : `${liveCollab ? "bg-green-400" : "bg-violet-500"} text-white`} cursor-pointer md:p-2 p-1 text-xs md:text-sm rounded-lg`}>
            Share
            </div>
        </div>
        <div className="flex justify-center">
        <div className="absolute flex text-black dark:text-white font-[Virgil]">
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} pan={pan} setPan={setPan} shape={shape} setShape={setShape}/>
        </div>

        <canvas onMouseDown={(e) => {
        }} ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className={`${darkMode ? "bg-black" : "bg-gray-100"}`}></canvas>
        </div>
    </div>
}