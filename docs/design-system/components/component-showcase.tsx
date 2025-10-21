"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Bold, Italic, Underline, ChevronDown, Copy, AlertCircle, Calendar as CalendarIcon, User } from "lucide-react"
import { componentCategories, componentRegistry } from "../data/components-registry"

interface ComponentShowcaseProps {
  searchQuery: string
}

export function ComponentShowcase({ searchQuery }: ComponentShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [progress, setProgress] = useState(66)

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    }
  })

  const filteredComponents = Object.entries(componentRegistry).reduce((acc, [category, components]) => {
    const filtered = components.filter(component => 
      (activeCategory === "all" || category === activeCategory) &&
      (searchQuery === "" || 
       component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       component.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as Record<string, typeof componentRegistry[keyof typeof componentRegistry]>)

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Copied ${name} code to clipboard`)
  }

  const renderComponent = (componentId: string) => {
    switch (componentId) {
      case "button":
        return (
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button size="icon"><Copy className="h-4 w-4" /></Button>
          </div>
        )
      case "toggle":
        return (
          <div className="flex gap-2">
            <Toggle>Toggle</Toggle>
            <Toggle pressed>Pressed</Toggle>
            <Toggle disabled>Disabled</Toggle>
          </div>
        )
      case "toggle-group":
        return (
          <ToggleGroup type="single">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Toggle underline">
              <Underline className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        )
      case "input":
        return (
          <div className="space-y-2 max-w-sm">
            <Input placeholder="Default input" />
            <Input placeholder="Disabled input" disabled />
            <Input type="email" placeholder="Email input" />
          </div>
        )
      case "textarea":
        return (
          <div className="max-w-sm">
            <Textarea placeholder="Type your message here." />
          </div>
        )
      case "select":
        return (
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm font-medium">
                Accept terms and conditions
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" defaultChecked />
              <label htmlFor="marketing" className="text-sm font-medium">
                Receive marketing emails
              </label>
            </div>
          </div>
        )
      case "radio-group":
        return (
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Option Two</Label>
            </div>
          </RadioGroup>
        )
      case "switch":
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" defaultChecked />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
          </div>
        )
      case "slider":
        return (
          <div className="w-[200px] space-y-4">
            <Slider defaultValue={[50]} max={100} step={1} />
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
        )
      case "input-otp":
        return (
          <div className="space-y-4">
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <p className="text-sm text-muted-foreground">Enter a 6-digit verification code</p>
          </div>
        )
      case "badge":
        return (
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        )
      case "card":
        return (
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Name of your project" />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )
      case "avatar":
        return (
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        )
      case "progress":
        return (
          <div className="w-[200px] space-y-4">
            <Progress value={progress} />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>-10</Button>
              <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>+10</Button>
            </div>
          </div>
        )
      case "chart":
        return (
          <div className="w-full">
            <div className="h-[200px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization placeholder</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Charts require additional Recharts setup
            </p>
          </div>
        )
      case "alert":
        return (
          <div className="space-y-2 max-w-md">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                You can add components to your app using the cli.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Your session has expired. Please log in again.
              </AlertDescription>
            </Alert>
          </div>
        )
      case "skeleton":
        return (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        )
      case "table":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">INV002</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>PayPal</TableCell>
                <TableCell className="text-right">$150.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )
      case "accordion":
        return (
          <Accordion type="single" collapsible className="w-full max-w-md">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other components' aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It's animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      case "tabs":
        return (
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Make changes to your account here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Pedro Duarte" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )
      case "separator":
        return (
          <div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
              <p className="text-sm text-muted-foreground">
                An open-source UI component library.
              </p>
            </div>
            <Separator className="my-4" />
            <div className="flex h-5 items-center space-x-4 text-sm">
              <div>Blog</div>
              <Separator orientation="vertical" />
              <div>Docs</div>
              <Separator orientation="vertical" />
              <div>Source</div>
            </div>
          </div>
        )
      case "aspect-ratio":
        return (
          <div className="w-[350px]">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">16:9 Aspect Ratio</span>
              </div>
            </AspectRatio>
          </div>
        )
      case "resizable":
        return (
          <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-[200px] items-center justify-center p-6">
                <span className="font-semibold">Panel One</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={25}>
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Panel Two</span>
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={75}>
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-semibold">Panel Three</span>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )
      case "dialog":
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )
      case "sheet":
        return (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're done.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        )
      case "alert-dialog":
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Show Alert</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      case "drawer":
        return (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>This action cannot be undone.</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )
      case "popover":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )
      case "tooltip":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "hover-card":
        return (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@nextjs</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/vercel.png" />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@nextjs</h4>
                  <p className="text-sm">
                    The React Framework – created and maintained by @vercel.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )
      case "dropdown-menu":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Open Menu
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      case "context-menu":
        return (
          <ContextMenu>
            <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <ContextMenuItem>Back</ContextMenuItem>
              <ContextMenuItem disabled>Forward</ContextMenuItem>
              <ContextMenuItem>Reload</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Save As...</ContextMenuItem>
              <ContextMenuItem>Print</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )
      case "menubar":
        return (
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  New Window <MenubarShortcut>⌘N</MenubarShortcut>
                </MenubarItem>
                <MenubarItem disabled>New Incognito Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>
                  Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Cut</MenubarItem>
                <MenubarItem>Copy</MenubarItem>
                <MenubarItem>Paste</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )
      case "calendar":
        return (
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        )
      case "command":
        return (
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </CommandItem>
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Search Emoji</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )
      case "scroll-area":
        return (
          <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="text-sm">
                v1.2.0-beta.{i}
              </div>
            ))}
          </ScrollArea>
        )
      case "collapsible":
        return (
          <Collapsible className="w-[350px] space-y-2">
            <div className="flex items-center justify-between space-x-4 px-4">
              <h4 className="text-sm font-semibold">
                @peduarte starred 3 repositories
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-sm">
              @radix-ui/primitives
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                @radix-ui/colors
              </div>
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                @stitches/react
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      case "breadcrumb":
        return (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )
      case "navigation-menu":
        return (
          <div className="relative">
            <nav className="flex items-center space-x-4 lg:space-x-6">
              <a className="text-sm font-medium transition-colors hover:text-primary" href="#">
                Overview
              </a>
              <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" href="#">
                Customers
              </a>
              <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" href="#">
                Products
              </a>
              <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary" href="#">
                Settings
              </a>
            </nav>
            <p className="text-xs text-muted-foreground mt-2">
              Navigation menu with dropdown support
            </p>
          </div>
        )
      case "pagination":
        return (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )
      case "sidebar":
        return (
          <div className="w-[280px] h-[400px] border rounded-lg overflow-hidden p-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Sidebar Component</p>
              <div className="space-y-1">
                <div className="px-3 py-2 rounded-md hover:bg-muted cursor-pointer">Dashboard</div>
                <div className="px-3 py-2 rounded-md hover:bg-muted cursor-pointer">Projects</div>
                <div className="px-3 py-2 rounded-md hover:bg-muted cursor-pointer">Settings</div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Full sidebar requires SidebarProvider context
              </p>
            </div>
          </div>
        )
      case "form":
        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => toast.success("Form submitted!"))} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )
      case "label":
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
        )
      case "toast":
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                })
              }}
            >
              Show Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.success("Successfully saved!")
              }}
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                toast.error("Something went wrong")
              }}
            >
              Error
            </Button>
          </div>
        )
      default:
        return <div className="text-muted-foreground">Component preview not available</div>
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
          All Components
        </Button>
        {componentCategories.map((category) => (
          <Button
            key={category.id}
            size="sm"
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Components Grid */}
      <div className="space-y-8">
        {Object.entries(filteredComponents).map(([category, components]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-heading font-semibold capitalize">
              {componentCategories.find(c => c.id === category)?.name || category}
            </h2>
            <div className="grid gap-6">
              {components.map((component) => (
                <Card key={component.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{component.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {component.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{component.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border bg-background p-6">
                      {renderComponent(component.id)}
                    </div>
                    {component.code && (
                      <div className="relative">
                        <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
                          <code className="text-sm">{component.code}</code>
                        </pre>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute right-2 top-2 h-8 w-8"
                          onClick={() => copyCode(component.code || "", component.name)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}