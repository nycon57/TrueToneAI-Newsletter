"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Layout, LogIn, Menu, ShoppingBag, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface BlockShowcaseProps {
  searchQuery: string
}

const blockCategories = [
  { 
    id: "calendar", 
    name: "Calendar", 
    icon: Calendar,
    count: 32,
    description: "Date pickers and calendar components for scheduling"
  },
  { 
    id: "dashboard", 
    name: "Dashboard", 
    icon: Layout,
    count: 1,
    description: "Complete dashboard layouts with charts and metrics"
  },
  { 
    id: "login", 
    name: "Authentication", 
    icon: LogIn,
    count: 5,
    description: "Login, signup, and authentication flows"
  },
  { 
    id: "sidebar", 
    name: "Sidebar", 
    icon: Menu,
    count: 16,
    description: "Navigation sidebars and menu layouts"
  },
  { 
    id: "products", 
    name: "E-commerce", 
    icon: ShoppingBag,
    count: 1,
    description: "Product listings and e-commerce components"
  },
]

export function BlockShowcase({ searchQuery }: BlockShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredCategories = blockCategories.filter(category => 
    (activeCategory === "all" || category.id === activeCategory) &&
    (searchQuery === "" || 
     category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const viewBlock = (category: string, blockName: string) => {
    toast.info(`Viewing ${blockName} from ${category} category`, {
      description: "This would open a preview of the block with code examples",
      action: {
        label: "View Docs",
        onClick: () => window.open("https://ui.shadcn.com/blocks", "_blank")
      }
    })
  }

  const getBlockExamples = (categoryId: string) => {
    switch (categoryId) {
      case "calendar":
        return [
          { name: "calendar-01", description: "Basic calendar with date selection" },
          { name: "calendar-02", description: "Calendar with events display" },
          { name: "calendar-03", description: "Date range picker" },
          { name: "calendar-04", description: "Calendar with time slots" },
          { name: "calendar-05", description: "Mini calendar widget" },
        ]
      case "dashboard":
        return [
          { name: "dashboard-01", description: "Analytics dashboard with charts, metrics, and activity feed" },
        ]
      case "login":
        return [
          { name: "login-01", description: "Simple login form" },
          { name: "login-02", description: "Login with social providers" },
          { name: "login-03", description: "Split screen login" },
          { name: "login-04", description: "Login with background image" },
          { name: "login-05", description: "Minimal login page" },
        ]
      case "sidebar":
        return [
          { name: "sidebar-01", description: "Collapsible sidebar" },
          { name: "sidebar-02", description: "Fixed sidebar with header" },
          { name: "sidebar-03", description: "Sidebar with nested menu" },
          { name: "sidebar-04", description: "Minimal icon sidebar" },
          { name: "sidebar-05", description: "Sidebar with user profile" },
        ]
      case "products":
        return [
          { name: "products-01", description: "Product grid with filters and sorting" },
        ]
      default:
        return []
    }
  }

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
        >
          All Blocks
        </Button>
        {blockCategories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon className="mr-2 h-4 w-4" />
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Blocks Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {category.count} {category.count === 1 ? 'block' : 'blocks'}
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getBlockExamples(category.id).slice(0, 3).map((example) => (
                  <Button
                    key={example.name}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => viewBlock(category.id, example.name)}
                  >
                    <span className="font-mono text-xs mr-2">{example.name}</span>
                    <span className="text-muted-foreground truncate flex-1 text-left">
                      {example.description}
                    </span>
                    <ExternalLink className="h-3 w-3 ml-2 flex-shrink-0" />
                  </Button>
                ))}
                {category.count > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setActiveCategory(category.id)
                      toast.info(`Showing all ${category.count} ${category.name} blocks`)
                    }}
                  >
                    View all {category.count} blocks
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Block Preview */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Featured: Dashboard Block</CardTitle>
          <CardDescription>
            A complete dashboard layout with sidebar navigation, metrics cards, charts, and data tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <div className="mx-auto max-w-2xl space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                      <div className="mt-2 h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                      <div className="mt-2 h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                      <div className="mt-2 h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="rounded-lg bg-background p-4 shadow-sm">
                      <div className="h-8 w-20 bg-muted rounded animate-pulse" />
                      <div className="mt-2 h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-background p-6 shadow-sm">
                      <div className="h-32 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="rounded-lg bg-background p-6 shadow-sm">
                      <div className="h-32 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-4 space-y-4">
              <ul className="grid gap-2 sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                  <span className="text-sm">Responsive sidebar navigation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                  <span className="text-sm">Metric cards with live data</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                  <span className="text-sm">Interactive charts using Recharts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                  <span className="text-sm">Data tables with sorting and filtering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                  <span className="text-sm">Dark mode support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="h-2 w-2 rounded-full p-0" />
                  <span className="text-sm">Fully accessible components</span>
                </li>
              </ul>
            </TabsContent>
            <TabsContent value="usage" className="mt-4">
              <div className="rounded-lg bg-muted p-4">
                <code className="text-sm">
                  npx shadcn@latest add dashboard-01
                </code>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                This command will add all the necessary components and dependencies for the dashboard block.
                The block includes example data and can be customized to fit your needs.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Explore All Blocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Blocks are pre-built components that you can copy and paste into your application. 
            They are built using shadcn/ui components and styled with your TrueTone brand colors.
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.open("https://ui.shadcn.com/blocks", "_blank")}
          >
            View Full Block Library
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}