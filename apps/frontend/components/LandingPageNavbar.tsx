import { Button } from "@repo/ui/button";
import { Git } from "@repo/ui/icons";
import { useRouter } from "next/navigation";
export default function Nav() {
  const router = useRouter();
  return (
    <div className="h-20 border border-b-2 flex p-2 items-center justify-between">
      <div className="text-2xl font-semibold ml-10 mt-1">Excalidraw</div>
      <div className="flex items-center space-x-6 mr-4">
        <a className="hover:scale-[1.05] p-1 bg-neutral-200 border border-1 border-black rounded-full transition-all duration-300 text-md cursor-pointer"
            href="https://github.com/DeekshithReddyA/Deepfake-Detection"
            target="_blank">
         <Git size={20}/> 
        </a>
        <div className="">
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              router.push('/canvas');
            }}  
            variant="primary"
            className="bg-purple-1300 rounded-full hover:bg-purple-1300/90 hover:scale-[1.05]"
            children={"Try Now"}
          />
        </div>
      </div>
    </div>
  );
}
