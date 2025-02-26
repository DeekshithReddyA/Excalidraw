"use client";
import { Draw } from "@/app/draw";
import { useEffect, useRef, useState } from "react"


type Shapes = "text" | "rect" | "ellipse" | "arrow"

export default function Canvas(){
    const [shape , setShape] = useState<Shapes>("rect");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawRef = useRef<{ setShape: (shape: Shapes) => void } | undefined>(null);
    useEffect(() => {
        if(canvasRef.current){
            drawRef.current = Draw(canvasRef.current);
        }
    }, [canvasRef])

    return<div className="w-screen h-screen">
        <div className="absolute text-black z-20">
            <button className="m-1 border border-black" onClick={() => {
                    setShape("text");
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
        </div>
        <canvas onMouseDown={(e) => {
            console.log(e);
        }} ref={canvasRef} width={window.innerWidth} height={window.innerHeight} className="bg-white"></canvas>
    </div>
}