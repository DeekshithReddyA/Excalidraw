"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: any;
  variant: "primary" | "secondary"
}

export const Button = ({ children, variant, className, onClick}: ButtonProps) => {
  const styles = {
    "primary" : "px-4 py-2 text-white shadow-md" ,
    "secondary" : ""
  }
  const hoverStyles = {
    "primary" : "hover:shadow-lg transition-all duration-300" ,
    "secondary" : ""
  }
  return (
    <div 
      className={`${styles[variant]} ${className} ${hoverStyles[variant]}`}
    >
    <button
      onClick={onClick}
      >
      {children}
    </button>
      </div>
  );
};
