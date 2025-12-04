"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  RowSelectionState,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArticleStatusBadge } from "@/components/admin/article-status-badge";
import { useBulkSelection } from "@/lib/contexts/bulk-selection-context";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  category: string | null;
  tags: string[];
  createdAt: Date;
  submittedAt: Date | null;
  createdBy: {
    name: string | null;
    email: string;
  } | null;
}

interface SelectableArticleTableProps {
  articles: Article[];
}

const columnHelper = createColumnHelper<Article>();

export function SelectableArticleTable({ articles }: SelectableArticleTableProps) {
  const { selectedIds, isSelected, toggleSelection, selectAll, selectedCount } =
    useBulkSelection();

  // Convert Set to RowSelectionState for TanStack Table
  const rowSelection: RowSelectionState = useMemo(() => {
    const selection: RowSelectionState = {};
    articles.forEach((article, index) => {
      if (selectedIds.has(article.id)) {
        selection[index] = true;
      }
    });
    return selection;
  }, [articles, selectedIds]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => {
          const allIds = articles.map((a) => a.id);
          const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
          const someSelected = allIds.some((id) => selectedIds.has(id)) && !allSelected;

          return (
            <Checkbox
              checked={allSelected ? true : someSelected ? "indeterminate" : false}
              onCheckedChange={() => selectAll(allIds)}
              aria-label="Select all"
            />
          );
        },
        cell: ({ row }) => (
          <Checkbox
            checked={isSelected(row.original.id)}
            onCheckedChange={() => toggleSelection(row.original.id)}
            aria-label={`Select ${row.original.title}`}
          />
        ),
      }),
      columnHelper.accessor("title", {
        header: "Article",
        cell: ({ row }) => (
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/articles/${row.original.id}`}
                className="font-medium truncate hover:underline hover:text-primary transition-colors"
              >
                {row.original.title}
              </Link>
              <ArticleStatusBadge status={row.original.status} />
            </div>
            {row.original.summary && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {row.original.summary}
              </p>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: ({ getValue, row }) => {
          const category = getValue();
          const tags = row.original.tags;
          return (
            <div className="flex flex-wrap gap-1">
              {category && <Badge variant="outline">{category}</Badge>}
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("createdBy", {
        header: "Creator",
        cell: ({ getValue }) => {
          const creator = getValue();
          return (
            <span className="text-sm text-muted-foreground">
              {creator?.name || creator?.email || "Unknown"}
            </span>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: ({ getValue }) => {
          const date = getValue();
          return (
            <span className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-2 justify-end">
            <Link href={`/admin/articles/${row.original.id}`}>
              <Button size="sm">Review</Button>
            </Link>
          </div>
        ),
      }),
    ],
    [articles, selectedIds, isSelected, toggleSelection, selectAll]
  );

  const table = useReactTable({
    data: articles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    enableRowSelection: true,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No articles pending review
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={isSelected(row.original.id) && "selected"}
                className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
