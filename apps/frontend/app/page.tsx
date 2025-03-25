"use client";
import { Features } from "@/components/Features";
import Nav from "@/components/LandingPageNavbar";
import { Button } from "@repo/ui/button";
import { ArrowRight } from "@repo/ui/icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="">
      <Nav />

      <div className="flex flex-col items-center justify-center w-full my-20">
        <div className="text-5xl text-neutral-800 font-semibold mb-5">Collaborative Drawing Made Simple</div>
        <div className="text-center text-neutral-600 text-2xl w-3/5 mb-10">Create, collaborate, and share beautiful diagrams with our whiteboard tool. Built with modern web technologies for speed and reliability.</div>
        <Button variant='primary' className='bg-purple-1300 px-4 py-3 text-xl hover:shadow-lg rounded-lg hover:bg-purple-1300/90 hover:scale-[1.04]' children={<div className="flex items-center">Try Now <div className="mx-2"><ArrowRight size={24}/></div></div>}/>
      </div>
      <br></br>
      <br></br>
      <Features />
      <br></br>
      <br></br>
      {/* <button onClick={(e) => {
        e.preventDefault();
        router.push("/canvas");
      }} className="bg-black text-white border border-white rounded-full px-4 py-2 font-bold">Get Started</button> */}
    </div>
  );
}
