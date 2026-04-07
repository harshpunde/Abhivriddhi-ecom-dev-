import React from 'react'

export function ThemeProvider({ children, ...props }) {
  // Simple theme provider for Vite React (no next-themes needed)
  return <>{children}</>
}
