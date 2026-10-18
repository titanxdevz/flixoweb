"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type FilterType = "flat" | "8d" | "bassboost" | "nightcore" | "vaporwave";

interface FilterContextType {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  mascotHop: boolean;
  triggerMascotHop: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("flat");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mascotHop, setMascotHop] = useState<boolean>(false);

  const triggerMascotHop = () => {
    setMascotHop(true);
    setTimeout(() => setMascotHop(false), 450);
  };

  return (
    <FilterContext.Provider
      value={{
        activeFilter,
        setActiveFilter,
        isPlaying,
        setIsPlaying,
        mascotHop,
        triggerMascotHop,
      }}
    >
      <div className={isPlaying && activeFilter === "bassboost" ? "bass-edge-pulsing min-h-screen" : "min-h-screen"}>
        {children}
      </div>
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within FilterProvider");
  }
  return context;
}
