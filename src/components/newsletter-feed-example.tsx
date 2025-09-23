"use client"

import * as React from "react"
import { NewsletterSearchFilters, type FilterState } from "@/components/newsletter-search-filters"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Example article data structure
interface Article {
  id: string
  title: string
  summary: string
  category: "mortgage" | "leadership" | "marketing"
  tags: string[]
  publishedAt: string
  readTime: number
}

// Mock data for demonstration
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Fed Cuts Rates: What This Means for Your Clients",
    summary: "The Federal Reserve announced a 0.25% rate cut today, creating new opportunities for homebuyers and those looking to refinance.",
    category: "mortgage",
    tags: ["Rate Alert", "Market Trends"],
    publishedAt: "2025-01-15",
    readTime: 5
  },
  {
    id: "2",
    title: "New FHA Loan Limits Give First-Time Buyers a Boost",
    summary: "The FHA has raised its loan limits for 2025, giving first-time and low-to-moderate income buyers more purchasing power.",
    category: "mortgage",
    tags: ["FHA Update", "First-Time Buyers"],
    publishedAt: "2025-01-14",
    readTime: 3
  },
  {
    id: "3",
    title: "Building Trust Through Transparent Communication",
    summary: "Learn how industry leaders maintain client relationships through clear, honest communication during market uncertainty.",
    category: "leadership",
    tags: ["Industry News"],
    publishedAt: "2025-01-13",
    readTime: 7
  },
  {
    id: "4",
    title: "Social Media Strategies That Convert Prospects",
    summary: "Discover the latest digital marketing tactics that top loan officers use to attract and convert leads.",
    category: "marketing",
    tags: ["Market Trends"],
    publishedAt: "2025-01-12",
    readTime: 6
  }
]

// Category styling configuration
const getCategoryStyle = (category: Article["category"]) => {
  switch (category) {
    case "mortgage":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
    case "leadership":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
    case "marketing":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
    default:
      return "bg-muted text-muted-foreground border-muted"
  }
}

export function NewsletterFeedExample() {
  const [filters, setFilters] = React.useState<FilterState>({
    search: "",
    categories: [],
    tags: [],
    sortBy: "date-desc"
  })

  // Filter articles based on current filters
  const filteredArticles = React.useMemo(() => {
    let filtered = [...MOCK_ARTICLES]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm) ||
        article.summary.toLowerCase().includes(searchTerm) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(article =>
        filters.categories.includes(article.category)
      )
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(article =>
        filters.tags.some(tag => article.tags.includes(tag))
      )
    }

    // Sort
    switch (filters.sortBy) {
      case "date-desc":
        filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case "date-asc":
        filtered.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
        break
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "relevance":
        // For demo purposes, keep original order for relevance
        break
    }

    return filtered
  }, [filters])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orchid to-indigo bg-clip-text text-transparent">
          TrueTone Insights
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay ahead with the latest mortgage industry insights, leadership strategies, and marketing tactics
          tailored for loan officers.
        </p>
      </div>

      {/* Search and Filters */}
      <NewsletterSearchFilters
        onFilterChange={setFilters}
        resultsCount={filteredArticles.length}
        initialFilters={filters}
      />

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="group hover:shadow-lg transition-all duration-200 border-lavender/20 hover:border-lavender/40">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getCategoryStyle(article.category))}
                  >
                    {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                  </Badge>
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-muted/50 hover:bg-muted"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {article.readTime} min read
                </div>
              </div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm line-clamp-3">
                {article.summary}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDate(article.publishedAt)}</span>
                <span className="hover:text-primary cursor-pointer transition-colors">
                  Read more →
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <div className="text-muted-foreground text-lg">No articles found</div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}