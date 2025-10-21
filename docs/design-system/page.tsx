"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrandSection } from "./components/brand-section"
import { ComponentShowcase } from "./components/component-showcase"
import { BlockShowcase } from "./components/block-showcase"
import { Playground } from "./components/playground"
import { DesignSystemShell } from "./components/design-system-shell"

export default function DesignSystemPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DesignSystemShell 
      searchQuery={searchQuery} 
      onSearchChange={setSearchQuery}
    >
      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="brand">Brand</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="mt-6">
          <BrandSection />
        </TabsContent>

        <TabsContent value="components" className="mt-6">
          <ComponentShowcase searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="blocks" className="mt-6">
          <BlockShowcase searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="playground" className="mt-6">
          <Playground />
        </TabsContent>
      </Tabs>
    </DesignSystemShell>
  )
}