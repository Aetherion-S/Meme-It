"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (windowHeight === 0) {
        setScrollProgress(0);
        return;
      }
      
      setScrollProgress(Number((totalScroll / windowHeight) * 100));
    };

    // Initialize progress on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 z-[60] w-full pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
