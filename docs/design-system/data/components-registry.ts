export interface ComponentExample {
  id: string
  name: string
  category: string
  description: string
  component: React.ComponentType<any>
  code?: string
  props?: Record<string, any>
}

export const componentCategories = [
  { id: "actions", name: "Actions", icon: "MousePointer" },
  { id: "data-input", name: "Data Input", icon: "TextCursor" },
  { id: "data-display", name: "Data Display", icon: "Monitor" },
  { id: "feedback", name: "Feedback", icon: "MessageSquare" },
  { id: "layout", name: "Layout", icon: "Layout" },
  { id: "navigation", name: "Navigation", icon: "Navigation" },
  { id: "overlay", name: "Overlay", icon: "Layers" },
  { id: "forms", name: "Forms", icon: "FileText" },
  { id: "utilities", name: "Utilities", icon: "Tool" },
] as const

export const componentRegistry: Record<string, ComponentExample[]> = {
  actions: [
    {
      id: "button",
      name: "Button",
      category: "actions",
      description: "Displays a button or a component that looks like a button",
      component: () => null, // Will be implemented
      code: `<Button variant="default">Click me</Button>`,
    },
    {
      id: "toggle",
      name: "Toggle",
      category: "actions",
      description: "A two-state button that can be either on or off",
      component: () => null,
      code: `<Toggle>Toggle me</Toggle>`,
    },
    {
      id: "toggle-group",
      name: "Toggle Group",
      category: "actions",
      description: "A set of two-state buttons that can be toggled on or off",
      component: () => null,
      code: `<ToggleGroup type="single">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ToggleGroup>`,
    },
  ],
  "data-input": [
    {
      id: "input",
      name: "Input",
      category: "data-input",
      description: "Displays a form input field or a component that looks like an input field",
      component: () => null,
      code: `<Input placeholder="Enter text..." />`,
    },
    {
      id: "textarea",
      name: "Textarea",
      category: "data-input",
      description: "Displays a form textarea or a component that looks like a textarea",
      component: () => null,
      code: `<Textarea placeholder="Enter message..." />`,
    },
    {
      id: "select",
      name: "Select",
      category: "data-input",
      description: "Displays a list of options for the user to pick from",
      component: () => null,
      code: `<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>`,
    },
    {
      id: "checkbox",
      name: "Checkbox",
      category: "data-input",
      description: "A control that allows the user to toggle between checked and not checked",
      component: () => null,
      code: `<Checkbox />`,
    },
    {
      id: "radio-group",
      name: "Radio Group",
      category: "data-input",
      description: "A set of checkable buttons where no more than one can be checked at a time",
      component: () => null,
      code: `<RadioGroup defaultValue="option-one">
  <RadioGroupItem value="option-one" id="option-one" />
  <RadioGroupItem value="option-two" id="option-two" />
</RadioGroup>`,
    },
    {
      id: "switch",
      name: "Switch",
      category: "data-input",
      description: "A control that allows the user to toggle between on and off",
      component: () => null,
      code: `<Switch />`,
    },
    {
      id: "slider",
      name: "Slider",
      category: "data-input",
      description: "An input where the user selects a value from within a given range",
      component: () => null,
      code: `<Slider defaultValue={[50]} max={100} step={1} />`,
    },
    {
      id: "input-otp",
      name: "Input OTP",
      category: "data-input",
      description: "Accessible one-time password component",
      component: () => null,
      code: `<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
</InputOTP>`,
    },
  ],
  "data-display": [
    {
      id: "badge",
      name: "Badge",
      category: "data-display",
      description: "Displays a badge or a component that looks like a badge",
      component: () => null,
      code: `<Badge>Badge</Badge>`,
    },
    {
      id: "card",
      name: "Card",
      category: "data-display",
      description: "Displays a card with header and content",
      component: () => null,
      code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
</Card>`,
    },
    {
      id: "table",
      name: "Table",
      category: "data-display",
      description: "A responsive table component",
      component: () => null,
      code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
    },
    {
      id: "avatar",
      name: "Avatar",
      category: "data-display",
      description: "An image element with a fallback for representing the user",
      component: () => null,
      code: `<Avatar>
  <AvatarImage src="/avatar.png" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>`,
    },
    {
      id: "progress",
      name: "Progress",
      category: "data-display",
      description: "Displays an indicator showing the completion progress of a task",
      component: () => null,
      code: `<Progress value={66} />`,
    },
    {
      id: "chart",
      name: "Chart",
      category: "data-display",
      description: "Beautiful charts built on top of Recharts",
      component: () => null,
      code: `<ChartContainer config={chartConfig}>
  <LineChart data={data}>
    <Line type="monotone" dataKey="value" />
  </LineChart>
</ChartContainer>`,
    },
  ],
  feedback: [
    {
      id: "alert",
      name: "Alert",
      category: "feedback",
      description: "Displays a callout for user attention",
      component: () => null,
      code: `<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app.
  </AlertDescription>
</Alert>`,
    },
    {
      id: "toast",
      name: "Toast (Sonner)",
      category: "feedback",
      description: "A succinct message that is displayed temporarily",
      component: () => null,
      code: `toast("Event has been created")`,
    },
    {
      id: "skeleton",
      name: "Skeleton",
      category: "feedback",
      description: "Use to show a placeholder while content is loading",
      component: () => null,
      code: `<Skeleton className="w-[100px] h-[20px] rounded-full" />`,
    },
  ],
  layout: [
    {
      id: "accordion",
      name: "Accordion",
      category: "layout",
      description: "A vertically stacked set of interactive headings",
      component: () => null,
      code: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    },
    {
      id: "collapsible",
      name: "Collapsible",
      category: "layout",
      description: "An interactive component which expands/collapses a panel",
      component: () => null,
      code: `<Collapsible>
  <CollapsibleTrigger>Can I use this?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. It's built with Radix UI.
  </CollapsibleContent>
</Collapsible>`,
    },
    {
      id: "tabs",
      name: "Tabs",
      category: "layout",
      description: "A set of layered sections of content",
      component: () => null,
      code: `<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="password">Password content</TabsContent>
</Tabs>`,
    },
    {
      id: "separator",
      name: "Separator",
      category: "layout",
      description: "Visually or semantically separates content",
      component: () => null,
      code: `<Separator />`,
    },
    {
      id: "aspect-ratio",
      name: "Aspect Ratio",
      category: "layout",
      description: "Displays content within a desired ratio",
      component: () => null,
      code: `<AspectRatio ratio={16 / 9}>
  <img src="/image.jpg" alt="Image" />
</AspectRatio>`,
    },
    {
      id: "resizable",
      name: "Resizable",
      category: "layout",
      description: "Accessible resizable panel groups and layouts",
      component: () => null,
      code: `<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>`,
    },
  ],
  navigation: [
    {
      id: "breadcrumb",
      name: "Breadcrumb",
      category: "navigation",
      description: "Displays the path to the current resource",
      component: () => null,
      code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
    },
    {
      id: "navigation-menu",
      name: "Navigation Menu",
      category: "navigation",
      description: "A collection of links for navigating websites",
      component: () => null,
      code: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Introduction</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
    },
    {
      id: "pagination",
      name: "Pagination",
      category: "navigation",
      description: "Pagination with page navigation, next and previous links",
      component: () => null,
      code: `<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`,
    },
    {
      id: "sidebar",
      name: "Sidebar",
      category: "navigation",
      description: "A composable, themeable and accessible sidebar component",
      component: () => null,
      code: `<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Home</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`,
    },
    {
      id: "menubar",
      name: "Menubar",
      category: "navigation",
      description: "A visually persistent menu common in desktop applications",
      component: () => null,
      code: `<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab</MenubarItem>
      <MenubarItem>New Window</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
    },
  ],
  overlay: [
    {
      id: "dialog",
      name: "Dialog",
      category: "overlay",
      description: "A window overlaid on primary content",
      component: () => null,
      code: `<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
    },
    {
      id: "sheet",
      name: "Sheet",
      category: "overlay",
      description: "Extends the Dialog component to display content from edge of screen",
      component: () => null,
      code: `<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
    },
    {
      id: "alert-dialog",
      name: "Alert Dialog",
      category: "overlay",
      description: "A modal dialog that interrupts with important content",
      component: () => null,
      code: `<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
    },
    {
      id: "drawer",
      name: "Drawer",
      category: "overlay",
      description: "A drawer component for mobile devices",
      component: () => null,
      code: `<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`,
    },
    {
      id: "popover",
      name: "Popover",
      category: "overlay",
      description: "Displays rich content in a portal, triggered by a button",
      component: () => null,
      code: `<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>
    Place content for the popover here.
  </PopoverContent>
</Popover>`,
    },
    {
      id: "tooltip",
      name: "Tooltip",
      category: "overlay",
      description: "A popup that displays information on hover",
      component: () => null,
      code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover</TooltipTrigger>
    <TooltipContent>
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    },
    {
      id: "hover-card",
      name: "Hover Card",
      category: "overlay",
      description: "For sighted users to preview content on hover",
      component: () => null,
      code: `<HoverCard>
  <HoverCardTrigger>@nextjs</HoverCardTrigger>
  <HoverCardContent>
    The React Framework.
  </HoverCardContent>
</HoverCard>`,
    },
    {
      id: "context-menu",
      name: "Context Menu",
      category: "overlay",
      description: "Displays a menu at the pointer position on right click",
      component: () => null,
      code: `<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Settings</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
    },
    {
      id: "dropdown-menu",
      name: "Dropdown Menu",
      category: "overlay",
      description: "Displays a menu to the user",
      component: () => null,
      code: `<DropdownMenu>
  <DropdownMenuTrigger>Open</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
    },
  ],
  forms: [
    {
      id: "form",
      name: "Form",
      category: "forms",
      description: "Building forms with React Hook Form and Zod",
      component: () => null,
      code: `<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="Enter username" {...field} />
          </FormControl>
          <FormDescription>
            This is your public display name.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>`,
    },
  ],
  utilities: [
    {
      id: "calendar",
      name: "Calendar",
      category: "utilities",
      description: "A date picker component with range selection",
      component: () => null,
      code: `<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>`,
    },
    {
      id: "command",
      name: "Command",
      category: "utilities",
      description: "Fast, composable command menu",
      component: () => null,
      code: `<Command>
  <CommandInput placeholder="Type a command..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
    },
    {
      id: "scroll-area",
      name: "Scroll Area",
      category: "utilities",
      description: "Augments native scroll functionality",
      component: () => null,
      code: `<ScrollArea className="h-[200px] w-[350px]">
  <div className="p-4">
    {/* Long content */}
  </div>
</ScrollArea>`,
    },
    {
      id: "label",
      name: "Label",
      category: "utilities",
      description: "Renders an accessible label associated with controls",
      component: () => null,
      code: `<Label htmlFor="email">Your email</Label>`,
    },
  ],
}