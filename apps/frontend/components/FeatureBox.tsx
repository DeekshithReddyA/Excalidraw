import { ReactNode } from "react";

export interface FeatureBoxProps{
    title : string;
    children : ReactNode;
    description : string;
}
export function FeatureBox(props: FeatureBoxProps){
    return(
        <div className="p-1 border hover:shadow-lg transition-all duration-300 rounded-lg">
        <div className="flex flex-col space-y-2 items-center justify-center">
            <div className="p-2 bg-neutral-300 rounded-full my-2">
                {props.children} 
            </div>
            <div className="text-xl font-semibold mb-4 text-center w-3/4">
                {props.title}
            </div>
            <div className="text-center w-3/4">
                {props.description}
            </div>
        </div>
        </div>
    );
}    