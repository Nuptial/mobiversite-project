"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

const HeaderBar = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shellClasses = clsx(
    "fixed inset-x-0 top-0 z-50 transition-shadow",
    isScrolled ? "shadow-md" : "shadow-sm shadow-transparent"
  );

  const surfaceClasses = clsx(
    "border-b backdrop-blur transition-colors",
    isScrolled
      ? "border-neutral-200 bg-white/95"
      : "border-transparent bg-white/85"
  );

  return (
    <header className={shellClasses}>
      <div className={surfaceClasses}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3 md:py-4">
          {children}
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
