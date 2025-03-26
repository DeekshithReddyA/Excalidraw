import { Pencil, Shapes, Users } from "@repo/ui/icons";
import { FeatureBox } from "./FeatureBox";

export function Features() {
  return (
    <div className="m-5">
      <div className="flex flex-col items-center justify-center w-full mt-10">
        <div className="text-3xl font-semibold mb-4">
          Powerful Features for Creative Collaboration
        </div>
        <div className="text-neutral-600 text-xl w-1/2 text-center mb-6">
          Our Excalidraw clone provides all the tools you need for seamless
          visual communication and collaboration.
        </div>
        <div className="flex justify-around space-x-3 m-10">
          <FeatureBox
            children={<Pencil size={36} />}
            title="Intuitive Drawing Tools"
            description="Create sketches, diagrams, and illustrations with our easy-to-use drawing tools that mimic the feel of pen and paper"
          />
          <FeatureBox
            children={<Users size={36} />}
            title="Real-time Collaboration"
            description="Work together with your team in real-time, seeing changes instantly as they happen, no matter where team members are located."
          />
          <FeatureBox
            children={<Shapes size={36} />}
            title="Extensive Shape Libraries"
            description="Access a wide range of pre-built shapes and components to quickly create professional diagrams and wireframes."
          />
        </div>
      </div>
    </div>
  );
}
