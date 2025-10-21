"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/shared/theme-toggle"

interface DesignSystemShellProps {
  children: React.ReactNode
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DesignSystemShell({ 
  children, 
  searchQuery, 
  onSearchChange 
}: DesignSystemShellProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-heading font-bold text-foreground">
              TrueTone Design System
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              A comprehensive guide to our UI components, brand identity, and design patterns
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components, colors, or patterns..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {children}
    </div>
  )
}