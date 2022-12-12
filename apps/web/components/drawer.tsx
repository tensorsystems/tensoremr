import React from "react";
import cn from "classnames";

interface Props {
  children: any;
  isOpen: boolean;
  width: "small" | "medium" | "full";
  setIsOpen: (open: boolean) => void;
}

export default function Drawer(props: Props) {
  const { children, isOpen, width, setIsOpen } = props;

  return (
    <main
      className={cn(
        "fixed overflow-hidden z-40 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out",
        {
          "transition-opacity opacity-100 duration-500 translate-x-0": isOpen,
          "transition-all delay-500 opacity-0 translate-x-full": !isOpen,
        }
      )}
    >
      <section
        className={cn(
          "right-0 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform rounded-sm",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
            "w-1/4": width === "small",
            "w-1/2": width === "medium",
            "left-10": width === "full",
          }
        )}
      >
        {children}
      </section>
      <section
        className="w-screen h-full cursor-pointer"
        onClick={() => {
          setIsOpen(false);
        }}
      ></section>
    </main>
  );
}
