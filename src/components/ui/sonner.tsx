"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--foreground))",
          "--success-bg": "hsl(var(--background))",
          "--success-border": "hsl(142 76% 36%)",
          "--success-text": "hsl(var(--foreground))",
          "--error-bg": "hsl(var(--background))",
          "--error-border": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--foreground))",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
