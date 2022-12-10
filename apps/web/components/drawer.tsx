import React from "react";
import cn from "classnames";

export default function Drawer({ children, isOpen, setIsOpen }) {
  return (
    <main
      className={cn(
        "fixed overflow-hidden z-50 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out",
        {
          "transition-opacity opacity-100 duration-500 translate-x-0": isOpen,
          "transition-all delay-500 opacity-0 translate-x-full": !isOpen,
        }
      )}
    >
      <section
        className={cn(
          "right-0 w-1/2 absolute bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform rounded-sm",
          {
            "translate-x-0": isOpen,
            "translate-x-full": !isOpen,
          }
        )}
      >
        <article className="relative w-screen max-w-lg pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
          <header className="p-4 font-bold text-lg">Header</header>
          {children}
        </article>
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
