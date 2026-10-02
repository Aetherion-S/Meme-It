"use client";

import { useState } from "react";

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button 
      onClick={() => setLiked(!liked)}
      className={`transition-colors ${liked ? "text-red-500" : "text-neutral-400 hover:text-red-500"}`} 
      aria-label={liked ? "Unlike meme" : "Like meme"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
          clipRule="evenodd" 
        />
      </svg>
    </button>
  );
}
