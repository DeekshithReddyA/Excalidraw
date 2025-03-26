import { Button } from "@repo/ui/button";
export default function Nav() {
  return (
    <div className="h-20 border border-b-2 flex p-2 items-center justify-between">
      <div className="text-2xl font-semibold ml-10 mt-1">Excalidraw</div>
      <div className="flex items-center space-x-6 mr-4">
        <div className="hover:scale-[1.05] transition-all duration-300 text-md cursor-pointer">
          Features
        </div>
        <div className="hover:scale-[1.05] transition-all duration-300 text-md cursor-pointer">
          Technical
        </div>
        <div className="">
          <Button
            variant="primary"
            className="bg-purple-1300 rounded-full hover:bg-purple-1300/90 hover:scale-[1.05]"
            children={"Try Now"}
          />
        </div>
      </div>
    </div>
  );
}
