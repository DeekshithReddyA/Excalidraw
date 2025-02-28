"use client";
import Canvas from "@/components/Canvas";
import { useParams } from "next/navigation";

type RoomId = string;
export default function CanvasWS(){
    const {roomId}: {roomId: RoomId} = useParams();
    return(<div>
        <Canvas roomId={roomId} />
    </div>)
}