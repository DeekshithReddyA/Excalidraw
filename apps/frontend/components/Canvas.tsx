// "use client";
// import { DrawingCanvas } from "@/app/draw";
// import { useEffect, useRef, useState } from "react"
// import { Shape } from "@/types/Shape";
// import Navbar from "./Navbar";
// import { ShareModal } from "./ShareModal";

// interface CanvasProps{
//     roomId?: string;
// }
// type Shapes = "text" | "rect" | "ellipse" | "arrow" | "";

// export default function Canvas({ roomId }: CanvasProps){
//     const [name , setName ]  = useState("");
//     const [link , setLink] = useState("");
//     let temp;
//     if(roomId !== undefined) temp = true;
//     else temp = false;
//     const [liveCollab , setLiveCollab] = useState<boolean>(temp);
//     const [modalOpen , setModalOpen] = useState<boolean>(false); 
//     const [darkMode , setDarkMode ] = useState<boolean>(false);
//     const [shape , setShape] = useState<Shapes>("rect");
//     const [pan , setPan] = useState<boolean>(false);
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//     const drawRef = useRef<DrawingCanvas | null>(null);
//     const wsRef = useRef<WebSocket | null>(null);

//     const [prevShapes, setPrevShapes] = useState<Shape[]>([]);

//     useEffect(() => {
//         try{
//             const str = localStorage.getItem('prevShapes') || '[]';
//             setPrevShapes(JSON.parse(str));
//         } catch(err){
//             setPrevShapes([]);
//         }
//     }, []);
    
//     useEffect(() => {
//         if(canvasRef.current){
//             drawRef.current = new DrawingCanvas(canvasRef.current, prevShapes);
//             if (prevShapes.length > 0) {
//                 drawRef.current.updateShapes(prevShapes);
//               }
//         }

//         if(roomId){
//             wsRef.current = new WebSocket(`ws://localhost:8080`);
//             wsRef.current.onopen = (socket) => {
                
//                 const data = {
//                 type : "join",
//                 roomId,
//                 prevShapes: drawRef.current?.getShapes()
//                 }
                
//                 wsRef.current?.send(JSON.stringify(data));
//             }

//             wsRef.current.onmessage = (event) => {
//                 console.log(event.data);
//                 const receiveShapes = JSON.parse(event.data);
//                 drawRef.current?.updateShapes(receiveShapes);
//             }

//             return () => {
//                 wsRef.current?.close();
//             }
//         }

//         return () => {
//             drawRef.current?.destroy();
//         }
//     }, [roomId, prevShapes])

//     useEffect(() => {
//         // Function to send shapes over WebSocket
        
//         const sendShapesUpdate = () => {
//             if (wsRef.current?.readyState === WebSocket.OPEN && drawRef.current) {
//                 const shapes = drawRef.current.getShapes();
//                 const data = {
//                     type : "draw",
//                     roomId,
//                     shapes
//                 }
//                 wsRef.current.send(JSON.stringify(data));
//             }
//         };
        
//         // Event listener for shape changes
//         const handleShapeChange = () => {
//             sendShapesUpdate();
//         };

//         const sendClearCanvas = () => {
//             drawRef.current?.clearCanvas();
//         }

//         const handleClearCanvas = () => {
//             sendClearCanvas();
//         }
        
//         // Add event listener
//         window.addEventListener('shapechange', handleShapeChange);
//         window.addEventListener('clearcanvas' , handleClearCanvas);
        
//         // Clean up event listener
//         return () => {
//             window.removeEventListener('shapechange', handleShapeChange);
//             window.addEventListener('clearcanvas' , handleClearCanvas);
//         };
//     }, []);


//     useEffect(() => {
//         drawRef.current?.setShape(shape);
//     }, [shape]);

//     useEffect(() => {
//         drawRef.current?.setPan(pan);
//     }, [pan]);
    
//     useEffect(() => {
//         if(darkMode)
//         drawRef.current?.setStrokeColor("dark");
//         else drawRef.current?.setStrokeColor("light");
//     }, [darkMode]);

//     useEffect(() => {
//         if(liveCollab) {
//             const generatedLink = crypto.randomUUID();
//             setLink(generatedLink);
//         }
//     },[liveCollab])

//     return<div className="relative overflow-hidden w-screen">
//         {modalOpen && <ShareModal link={link} liveCollab={liveCollab} setLiveCollab={setLiveCollab} setModalOpen={setModalOpen} name={name} setName={setName} darkMode={darkMode}/>}
//         <div className="absolute md:right-5 md:top-5 right-2 top-5 text-black">
//             <div onClick={(e) => {
//                 e.preventDefault();
//                 console.log(liveCollab);
//                 setModalOpen(true);
//             }} className={`${darkMode ? `${liveCollab ? "bg-green-500" : "bg-violet-400"} text-black` : `${liveCollab ? "bg-green-400" : "bg-violet-500"} text-white`} cursor-pointer md:p-2 p-1 text-xs md:text-sm rounded-lg`}>
//             Share
//             </div>
//         </div>
//         <div className="flex justify-center">
//         <div className="absolute flex text-black dark:text-white font-[Virgil]">
//             <Navbar darkMode={darkMode} setDarkMode={setDarkMode} pan={pan} setPan={setPan} shape={shape} setShape={setShape}/>
//         </div>

//         <canvas onMouseDown={(e) => {
//         }} ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className={`${darkMode ? "bg-black" : "bg-gray-100"}`}></canvas>
//         </div>
//     </div>
// }

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
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [prevShapes, setPrevShapes] = useState<Shape[]>([]);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 }); // Start with zero size
    
    let temp;
    if(roomId !== undefined) temp = true;
    else temp = false;
    
    const [liveCollab, setLiveCollab] = useState<boolean>(temp);
    const [modalOpen, setModalOpen] = useState<boolean>(false); 
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [shape, setShape] = useState<Shapes>("rect");
    const [pan, setPan] = useState<boolean>(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<DrawingCanvas | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Handle window resize and initial canvas sizing
    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            // Update canvas size function
            const updateCanvasSize = () => {
                // Use the full viewport dimensions
                setCanvasSize({ 
                    width: window.innerWidth, 
                    height: window.innerHeight 
                });
            };
            
            // Set initial size
            updateCanvasSize();
            
            // Handle resize events
            window.addEventListener('resize', updateCanvasSize);
            
            return () => window.removeEventListener('resize', updateCanvasSize);
        }
    }, []);
    
    // Load shapes from localStorage
    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            try {
                const str = localStorage.getItem('prevShapes') || '[]';
                const loadedShapes = JSON.parse(str);
                setPrevShapes(loadedShapes);
            } catch (error) {
                console.error("Error loading shapes from localStorage:", error);
            }
        }
    }, []);
    
    // Initialize canvas and websocket
    useEffect(() => {
        // Only initialize when canvas has dimensions and is mounted
        if (canvasRef.current && canvasSize.width > 0 && canvasSize.height > 0) {
            drawRef.current = new DrawingCanvas(canvasRef.current, prevShapes);
            
            // Ensure shapes are rendered
            if (prevShapes.length > 0) {
                drawRef.current.updateShapes(prevShapes);
            }
        }

        if (roomId && typeof window !== 'undefined' && drawRef.current) {
            wsRef.current = new WebSocket(`ws://localhost:8080`);
            wsRef.current.onopen = () => {
                const data = {
                    type: "join",
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
    }, [roomId, prevShapes, canvasSize]);

    useEffect(() => {
        // Function to send shapes over WebSocket
        const sendShapesUpdate = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN && drawRef.current) {
                const shapes = drawRef.current.getShapes();
                const data = {
                    type: "draw",
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
        
        // Only add event listeners on client-side
        if (typeof window !== 'undefined') {
            window.addEventListener('shapechange', handleShapeChange);
            window.addEventListener('clearcanvas', handleClearCanvas);
            
            // Clean up event listener
            return () => {
                window.removeEventListener('shapechange', handleShapeChange);
                window.removeEventListener('clearcanvas', handleClearCanvas);
            };
        }
    }, [roomId]);

    useEffect(() => {
        drawRef.current?.setShape(shape);
    }, [shape]);

    useEffect(() => {
        drawRef.current?.setPan(pan);
    }, [pan]);
    
    useEffect(() => {
        if(darkMode)
            drawRef.current?.setStrokeColor("dark");
        else 
            drawRef.current?.setStrokeColor("light");
    }, [darkMode]);

    useEffect(() => {
        if(liveCollab && typeof window !== 'undefined') {
            const generatedLink = crypto.randomUUID();
            setLink(generatedLink);
        }
    }, [liveCollab]);

    return (
        <div ref={containerRef} className="relative overflow-hidden w-screen h-screen">
            {modalOpen && (
                <ShareModal 
                    link={link} 
                    liveCollab={liveCollab} 
                    setLiveCollab={setLiveCollab} 
                    setModalOpen={setModalOpen} 
                    name={name} 
                    setName={setName} 
                    darkMode={darkMode}
                />
            )}
            <div className="absolute md:right-5 md:top-5 right-2 top-5 text-black">
                <div 
                    onClick={(e) => {
                        e.preventDefault();
                        console.log(liveCollab);
                        setModalOpen(true);
                    }} 
                    className={`${darkMode ? `${liveCollab ? "bg-green-500" : "bg-violet-400"} text-black` : `${liveCollab ? "bg-green-400" : "bg-violet-500"} text-white`} cursor-pointer md:p-2 p-1 text-xs md:text-sm rounded-lg`}
                >
                    Share
                </div>
            </div>
            <div className="flex justify-center h-full w-full">
                <div className="absolute flex text-black dark:text-white font-[Virgil]">
                    <Navbar 
                        darkMode={darkMode} 
                        setDarkMode={setDarkMode} 
                        pan={pan} 
                        setPan={setPan} 
                        shape={shape} 
                        setShape={setShape}
                    />
                </div>

                {canvasSize.width > 0 && canvasSize.height > 0 && (
                    <canvas 
                        ref={canvasRef} 
                        width={canvasSize.width} 
                        height={canvasSize.height} 
                        className={`${darkMode ? "bg-black" : "bg-gray-100"} w-full h-full`}
                    ></canvas>
                )}
            </div>
        </div>
    );
}