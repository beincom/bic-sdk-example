"use client";

import React from "react";
import { SnackbarProvider } from "notistack";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SnackbarProvider maxSnack={8}>{children}</SnackbarProvider>;
};

export default Providers;
