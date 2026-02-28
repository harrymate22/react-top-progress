"use client";

import React from "react";
import { TopProgress, TopProgressProps } from "./TopProgress";

export interface ProgressProviderProps extends TopProgressProps {
  children: React.ReactNode;
}

export const ProgressProvider = ({
  children,
  ...props
}: ProgressProviderProps) => {
  return (
    <>
      <TopProgress {...props} />
      {children}
    </>
  );
};
