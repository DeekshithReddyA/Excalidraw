"use client";
import {
  ArrowRight,
  Bin,
  Circle,
  Grab,
  Hand,
  Moon,
  Pencil,
  Square,
  Sun,
  T,
} from "@repo/ui/icons";

interface NavbarProps {
  shape: "rect" | "ellipse" | "arrow" | "text" | "freehand" | "";
  setShape: any;
  pan: boolean;
  setPan: any;
  darkMode: boolean;
  setDarkMode: any;
}

export default function Navbar(props: NavbarProps) {
  const iconStyles = `${props.darkMode ? "text-white" : "text-black"} md:p-3 p-1 rounded-lg cursor-pointer flex items-center justify-center`;
  const bg_blue = `${props.darkMode ? "bg-blue-1000" : "bg-purple-1100"}`;
  const hoverStyle = `${props.darkMode ? "hover:bg-neutral-600/40" : "hover:bg-purple-1100/60"}`;

  return (
    <div
      className={`${props.darkMode ? "bg-blue-1100" : "bg-white border border-neutral-200"} m-2 mt-4 p-1 rounded-lg shadow-md`}
    >
      <div className="flex gap-x-2">
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setDarkMode((v: boolean) => !v);
          }}
          className={`${iconStyles} ${hoverStyle} ml-1`}
        >
          {props.darkMode ? <Sun /> : <Moon />}
        </div>
        <div
          className={`${props.darkMode ? "border-neutral-600" : ""} border border-r my-2`}
        ></div>
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setPan(true);
            props.setShape("");
          }}
          className={`${iconStyles} ${props.pan ? bg_blue : hoverStyle}`}
        >
          <Hand />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setShape("rect");
            props.setPan(false);
          }}
          className={`${iconStyles} ${props.shape === "rect" ? bg_blue : hoverStyle}`}
        >
          <Square />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setShape("ellipse");
            props.setPan(false);
          }}
          className={`${iconStyles} ${props.shape === "ellipse" ? bg_blue : hoverStyle}`}
        >
          <Circle />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setShape("arrow");
            props.setPan(false);
          }}
          className={`${iconStyles} ${props.shape === "arrow" ? bg_blue : hoverStyle}`}
        >
          <ArrowRight size={18} />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setShape("freehand");
            props.setPan(false);
          }}
          className={`${iconStyles} ${props.shape === "freehand" ? bg_blue : hoverStyle}`}
        >
          <Pencil size={17} />
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            props.setShape("text");
            props.setPan(false);
          }}
          className={`${iconStyles} ${props.shape === "text" ? bg_blue : hoverStyle}`}
        >
          <T />
        </div>
        <div
          className={`${props.darkMode ? "border-neutral-600" : ""} border border-r my-2`}
        ></div>
        <div
          onClick={(e) => {
            e.preventDefault();
            const event = new CustomEvent("clearcanvas");
            window.dispatchEvent(event);
          }}
          className={`${iconStyles} hover:bg-red-500/50 mr-1`}
        >
          <Bin />
        </div>
      </div>
    </div>
  );
}
