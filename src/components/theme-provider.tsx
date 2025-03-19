"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps as NextThemeProviderProps,
} from "next-themes";

// Extend the next-themes ThemeProviderProps instead of creating our own
type ThemeProviderProps = NextThemeProviderProps;

// Export ThemeProvider with proper typing
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
