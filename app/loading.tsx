"use client";

import React from "react";

export default function GlobalLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div
        className="
          h-1 
          bg-blue-500 
          animate-progress 
          origin-left 
          transform 
          scale-x-0
        "
      ></div>
    </div>
  );
}
