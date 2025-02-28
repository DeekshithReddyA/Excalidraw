"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Excalidraw landing page
      <button onClick={(e) => {
        e.preventDefault();
        router.push("/canvas");
      }} className="bg-black text-white border border-white rounded-full px-4 py-2 font-bold">Get Started</button>
    </div>
  );
}
