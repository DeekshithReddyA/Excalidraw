"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
  onClick?: any;
  variant: "primary" | "primary-dark"
}

export const Button = ({ children, variant, className, onClick, appName }: ButtonProps) => {
  const styles = {
    "primary" : "" ,
    "primary-dark" : ""
  }
  return (
    <button 
      className={`${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
