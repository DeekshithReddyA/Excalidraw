"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {

  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  return (
    <div>
      <input type="text" placeholder="RoomId" name="roomId" value={roomId} onChange={(e) => {
        setRoomId(e.target.value);
      }}></input>
      <button onClick={() => {
        router.push(`/room/${roomId}`);
      }} >Join Room</button>
    </div>
  );
}
