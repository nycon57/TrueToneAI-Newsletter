"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Copy } from "lucide-react"
import { toast } from "sonner"

export function BrandSection() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Copied ${label} to clipboard`)
  }

  const brandColors = [
    { name: "Shadow", value: "#131321", rgb: "19, 19, 33", class: "bg-shadow" },
    { name: "Indigo", value: "#2C2A4A", rgb: "44, 42, 74", class: "bg-indigo" },
    { name: "Orchid", value: "#4F518C", rgb: "79, 81, 140", class: "bg-orchid" },
    { name: "Lilac", value: "#9D7AD6", rgb: "144, 122, 214", class: "bg-lilac" },
    { name: "Lavender", value: "#DABFFF", rgb: "218, 191, 255", class: "bg-lavender" },
    { name: "Skyward", value: "#7FEDFF", rgb: "127, 222, 255", class: "bg-skyward" },
  ]

  const themeColors = [
    { name: "Background", value: "hsl(var(--background))", class: "bg-background border" },
    { name: "Foreground", value: "hsl(var(--foreground))", class: "bg-foreground" },
    { name: "Primary", value: "hsl(var(--primary))", class: "bg-primary" },
    { name: "Secondary", value: "hsl(var(--secondary))", class: "bg-secondary" },
    { name: "Accent", value: "hsl(var(--accent))", class: "bg-accent" },
    { name: "Muted", value: "hsl(var(--muted))", class: "bg-muted" },
    { name: "Destructive", value: "hsl(var(--destructive))", class: "bg-destructive" },
  ]

  const typographyScale = [
    { name: "Display", class: "text-6xl", size: "60px", weight: "font-bold", sample: "TrueTone AI" },
    { name: "Heading 1", class: "text-4xl", size: "36px", weight: "font-bold", sample: "Build Your Voice" },
    { name: "Heading 2", class: "text-3xl", size: "30px", weight: "font-semibold", sample: "Content Creation" },
    { name: "Heading 3", class: "text-2xl", size: "24px", weight: "font-semibold", sample: "Design System" },
    { name: "Body Large", class: "text-lg", size: "18px", weight: "font-normal", sample: "Create authentic content that resonates" },
    { name: "Body", class: "text-base", size: "16px", weight: "font-normal", sample: "Your brand voice, amplified by AI" },
    { name: "Small", class: "text-sm", size: "14px", weight: "font-normal", sample: "Powered by advanced AI technology" },
  ]

  const animations = [
    { name: "Fade In", class: "animate-fade-in", duration: "0.3s" },
    { name: "Slide Up", class: "animate-slide-up", duration: "0.4s" },
    { name: "Scale In", class: "animate-scale-in", duration: "0.3s" },
    { name: "Shimmer", class: "animate-shimmer", duration: "2s" },
    { name: "Orb Wave", class: "animate-orb-wave", duration: "0.4s" },
    { name: "Voice Wave", class: "animate-voice-wave", duration: "1s" },
    { name: "Spin Slow", class: "animate-spin-slow", duration: "3s" },
  ]

  const spacing = [
    { name: "0", value: "0px", class: "p-0" },
    { name: "1", value: "4px", class: "p-1" },
    { name: "2", value: "8px", class: "p-2" },
    { name: "3", value: "12px", class: "p-3" },
    { name: "4", value: "16px", class: "p-4" },
    { name: "6", value: "24px", class: "p-6" },
    { name: "8", value: "32px", class: "p-8" },
    { name: "12", value: "48px", class: "p-12" },
  ]

  return (
    <div className="space-y-8">
      {/* Brand Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Brand Colors</CardTitle>
          <CardDescription>Our primary brand color palette</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandColors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div 
                  className={`${color.class} h-24 rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105`}
                  onClick={() => copyToClipboard(color.value, color.name)}
                />
                <div className="space-y-1">
                  <p className="font-medium text-sm">{color.name}</p>
                  <p className="text-xs text-muted-foreground">{color.value}</p>
                  <p className="text-xs text-muted-foreground">rgb({color.rgb})</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Theme Colors</CardTitle>
          <CardDescription>Semantic color tokens that adapt to light/dark mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {themeColors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div 
                  className={`${color.class} h-20 rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105`}
                  onClick={() => copyToClipboard(color.value, color.name)}
                />
                <div className="space-y-1">
                  <p className="font-medium text-sm">{color.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{color.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Typography</CardTitle>
          <CardDescription>Font families and type scale</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline">Headings</Badge>
                <span className="font-heading text-lg">Signal Font Family</span>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline">Body</Badge>
                <span className="font-sans text-lg">Inter Font Family</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              {typographyScale.map((type) => (
                <div key={type.name} className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4 flex-1">
                    <span className="text-sm text-muted-foreground w-24">{type.name}</span>
                    <span className={`${type.class} ${type.weight} ${type.name.includes('Heading') ? 'font-heading' : 'font-sans'}`}>
                      {type.sample}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{type.size}</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(type.class, type.name)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Spacing</CardTitle>
          <CardDescription>Consistent spacing scale for padding and margins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spacing.map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-12">{space.name}</span>
                <div className="flex items-center gap-4 flex-1">
                  <div className={`bg-orchid ${space.class} rounded`} />
                  <span className="text-sm font-mono">{space.value}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(space.class, `spacing-${space.name}`)}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copy class
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Animations</CardTitle>
          <CardDescription>Motion design tokens for consistent interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animations.map((animation) => (
              <div key={animation.name} className="space-y-2">
                <div className="h-20 bg-gradient-to-br from-orchid/20 to-lilac/20 rounded-lg flex items-center justify-center">
                  <div className={`w-12 h-12 bg-orchid rounded-lg ${animation.class}`} />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{animation.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{animation.duration}</Badge>
                    <code className="text-xs text-muted-foreground">{animation.class}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Border Radius</CardTitle>
          <CardDescription>Consistent corner radius values</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "None", class: "rounded-none", value: "0px" },
              { name: "Small", class: "rounded-sm", value: "calc(var(--radius) - 4px)" },
              { name: "Default", class: "rounded-md", value: "calc(var(--radius) - 2px)" },
              { name: "Large", class: "rounded-lg", value: "var(--radius)" },
              { name: "XL", class: "rounded-xl", value: "12px" },
              { name: "2XL", class: "rounded-2xl", value: "16px" },
              { name: "3XL", class: "rounded-3xl", value: "24px" },
              { name: "Full", class: "rounded-full", value: "9999px" },
            ].map((radius) => (
              <div key={radius.name} className="space-y-2">
                <div className={`h-20 bg-orchid ${radius.class} flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">{radius.name}</span>
                </div>
                <div className="space-y-1">
                  <code className="text-xs">{radius.class}</code>
                  <p className="text-xs text-muted-foreground">{radius.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}