"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, Palette, Type, Layers, Sparkles } from "lucide-react"
import { toast } from "sonner"

export function Playground() {
  // Button customization state
  const [buttonText, setButtonText] = useState("Click me")
  const [buttonVariant, setButtonVariant] = useState<any>("default")
  const [buttonSize, setButtonSize] = useState<any>("default")
  const [buttonIcon, setButtonIcon] = useState(false)

  // Card customization state
  const [cardTitle, setCardTitle] = useState("Card Title")
  const [cardDescription, setCardDescription] = useState("Card description goes here")
  const [cardContent, setCardContent] = useState("This is the card content. You can customize it!")
  const [cardBorder, setCardBorder] = useState(true)

  // Input customization state
  const [inputPlaceholder, setInputPlaceholder] = useState("Enter text...")
  const [inputType, setInputType] = useState("text")
  const [inputDisabled, setInputDisabled] = useState(false)

  // Badge customization state
  const [badgeText, setBadgeText] = useState("Badge")
  const [badgeVariant, setBadgeVariant] = useState<any>("default")

  // Animation customization
  const [animationType, setAnimationType] = useState("none")
  const [animationDuration, setAnimationDuration] = useState([300])

  const copyComponentCode = (component: string, code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Copied ${component} code to clipboard`)
  }

  const exportTheme = () => {
    const theme = {
      colors: {
        shadow: "#131321",
        indigo: "#2C2A4A",
        orchid: "#4F518C",
        lilac: "#9D7AD6",
        lavender: "#DABFFF",
        skyward: "#7FEDFF",
      },
      fonts: {
        heading: "Signal",
        body: "Inter",
      },
      animations: {
        duration: animationDuration[0],
        type: animationType,
      }
    }
    
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'truetone-theme.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Theme exported successfully")
  }

  const getButtonCode = () => {
    return `<Button variant="${buttonVariant}" size="${buttonSize}">
  ${buttonIcon ? '<Copy className="mr-2 h-4 w-4" />' : ''}
  ${buttonText}
</Button>`
  }

  const getCardCode = () => {
    return `<Card${!cardBorder ? ' className="border-0"' : ''}>
  <CardHeader>
    <CardTitle>${cardTitle}</CardTitle>
    <CardDescription>${cardDescription}</CardDescription>
  </CardHeader>
  <CardContent>
    <p>${cardContent}</p>
  </CardContent>
</Card>`
  }

  const getInputCode = () => {
    return `<Input 
  type="${inputType}" 
  placeholder="${inputPlaceholder}"${inputDisabled ? '\n  disabled' : ''}
/>`
  }

  const getBadgeCode = () => {
    return `<Badge variant="${badgeVariant}">${badgeText}</Badge>`
  }

  const getAnimationClass = () => {
    switch (animationType) {
      case "fade-in": return "animate-fade-in"
      case "slide-up": return "animate-slide-up"
      case "scale-in": return "animate-scale-in"
      case "shimmer": return "animate-shimmer"
      case "orb-wave": return "animate-orb-wave"
      case "spin-slow": return "animate-spin-slow"
      default: return ""
    }
  }

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-heading flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Component Playground
          </CardTitle>
          <CardDescription>
            Customize components in real-time and see how they look with your brand colors
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Component Customizers */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Button Customizer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Button Component
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input 
                  value={buttonText} 
                  onChange={(e) => setButtonText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Variant</Label>
                <Select value={buttonVariant} onValueChange={setButtonVariant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <RadioGroup value={buttonSize} onValueChange={setButtonSize}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sm" id="sm" />
                    <Label htmlFor="sm">Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default">Default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lg" id="lg" />
                    <Label htmlFor="lg">Large</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="icon"
                  checked={buttonIcon}
                  onCheckedChange={setButtonIcon}
                />
                <Label htmlFor="icon">Show Icon</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
                <Button 
                  variant={buttonVariant} 
                  size={buttonSize}
                  className={getAnimationClass()}
                  style={{ animationDuration: `${animationDuration[0]}ms` }}
                >
                  {buttonIcon && <Copy className="mr-2 h-4 w-4" />}
                  {buttonText}
                </Button>
              </div>

              <div className="relative">
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                  <code className="text-sm">{getButtonCode()}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => copyComponentCode("Button", getButtonCode())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Customizer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Card Component
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={cardTitle} 
                  onChange={(e) => setCardTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Input 
                  value={cardDescription} 
                  onChange={(e) => setCardDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  value={cardContent} 
                  onChange={(e) => setCardContent(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="border"
                  checked={cardBorder}
                  onCheckedChange={setCardBorder}
                />
                <Label htmlFor="border">Show Border</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Card className={`${!cardBorder ? 'border-0' : ''} ${getAnimationClass()}`}
                style={{ animationDuration: `${animationDuration[0]}ms` }}>
                <CardHeader>
                  <CardTitle>{cardTitle}</CardTitle>
                  <CardDescription>{cardDescription}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{cardContent}</p>
                </CardContent>
              </Card>

              <div className="relative">
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                  <code className="text-sm">{getCardCode()}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => copyComponentCode("Card", getCardCode())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Customizer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Input Component
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Placeholder</Label>
                <Input 
                  value={inputPlaceholder} 
                  onChange={(e) => setInputPlaceholder(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={inputType} onValueChange={setInputType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="search">Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="disabled"
                  checked={inputDisabled}
                  onCheckedChange={setInputDisabled}
                />
                <Label htmlFor="disabled">Disabled</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
                <Input 
                  type={inputType}
                  placeholder={inputPlaceholder}
                  disabled={inputDisabled}
                  className={`max-w-sm ${getAnimationClass()}`}
                  style={{ animationDuration: `${animationDuration[0]}ms` }}
                />
              </div>

              <div className="relative">
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                  <code className="text-sm">{getInputCode()}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => copyComponentCode("Input", getInputCode())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Customizer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Badge Component
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input 
                  value={badgeText} 
                  onChange={(e) => setBadgeText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Variant</Label>
                <Select value={badgeVariant} onValueChange={setBadgeVariant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-center p-8 rounded-lg bg-muted/50">
                <Badge 
                  variant={badgeVariant}
                  className={getAnimationClass()}
                  style={{ animationDuration: `${animationDuration[0]}ms` }}
                >
                  {badgeText}
                </Badge>
              </div>

              <div className="relative">
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                  <code className="text-sm">{getBadgeCode()}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8"
                  onClick={() => copyComponentCode("Badge", getBadgeCode())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animation Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Animation Settings</CardTitle>
          <CardDescription>
            Apply animations to all components in the playground
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Animation Type</Label>
              <Select value={animationType} onValueChange={setAnimationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="fade-in">Fade In</SelectItem>
                  <SelectItem value="slide-up">Slide Up</SelectItem>
                  <SelectItem value="scale-in">Scale In</SelectItem>
                  <SelectItem value="shimmer">Shimmer</SelectItem>
                  <SelectItem value="orb-wave">Orb Wave</SelectItem>
                  <SelectItem value="spin-slow">Spin Slow</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration: {animationDuration[0]}ms</Label>
              <Slider
                value={animationDuration}
                onValueChange={setAnimationDuration}
                min={100}
                max={2000}
                step={100}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Theme */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Export Your Customizations</CardTitle>
          <CardDescription>
            Download your theme configuration to use in your projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={exportTheme}>
            <Download className="mr-2 h-4 w-4" />
            Export Theme Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}