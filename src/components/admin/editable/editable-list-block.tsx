"use client";

import { useState, useRef, useId } from "react";
import { motion, AnimatePresence, Reorder, useDragControls } from "motion/react";
import { Pencil, Check, X, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditableListBlockProps {
  label: string;
  items: string[];
  field: string;
  articleId: string;
  className?: string;
  onSave?: (field: string, value: string[]) => Promise<void>;
}

interface ListItem {
  id: string;
  value: string;
}

interface DraggableItemProps {
  item: ListItem;
  index: number;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (value: string) => void;
  onRemove: () => void;
}

function DraggableItem({ item, index, inputRef, onChange, onRemove }: DraggableItemProps) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-2 bg-background rounded-md p-1"
      style={{ position: "relative" }}
    >
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          dragControls.start(e);
        }}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none select-none"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Input
        ref={inputRef}
        value={item.value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 border-2 border-violet-500/30 focus:border-violet-500"
        placeholder={`Insight ${index + 1}...`}
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={onRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </Reorder.Item>
  );
}

let itemIdCounter = 0;
function generateId() {
  return `item-${Date.now()}-${++itemIdCounter}`;
}

function stringsToListItems(strings: string[]): ListItem[] {
  return strings.map((value) => ({ id: generateId(), value }));
}

function listItemsToStrings(items: ListItem[]): string[] {
  return items.map((item) => item.value);
}

export function EditableListBlock({
  label,
  items,
  field,
  articleId,
  className,
  onSave,
}: EditableListBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editItems, setEditItems] = useState<ListItem[]>(() => stringsToListItems(items));
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSave = async () => {
    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    // Filter out empty items
    const filteredItems = editItems.filter((item) => item.value.trim() !== "");
    const stringItems = listItemsToStrings(filteredItems);

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(field, stringItems);
      } else {
        const response = await fetch(`/api/admin/articles/${articleId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: stringItems }),
        });
        if (!response.ok) throw new Error("Failed to save");
      }
      setEditItems(filteredItems);
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditItems(stringsToListItems(items));
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleItemChange = (id: string, value: string) => {
    setEditItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
    setHasChanges(true);
  };

  const handleAddItem = () => {
    const newItem: ListItem = { id: generateId(), value: "" };
    setEditItems((prev) => [...prev, newItem]);
    setHasChanges(true);
    // Focus new input after render
    setTimeout(() => {
      const lastInput = inputRefs.current[editItems.length];
      lastInput?.focus();
    }, 50);
  };

  const handleRemoveItem = (id: string) => {
    setEditItems((prev) => prev.filter((item) => item.id !== id));
    setHasChanges(true);
  };

  const handleReorder = (newOrder: ListItem[]) => {
    setEditItems(newOrder);
    setHasChanges(true);
  };

  return (
    <div className={cn("group relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
          {label}
        </h4>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing-controls"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1.5"
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={cn(
                  "h-7 px-3 transition-all",
                  hasChanges
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5 mr-1" />
                )}
                Save
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="edit-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-7 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="space-y-2"
          >
            <Reorder.Group
              axis="y"
              values={editItems}
              onReorder={handleReorder}
              className="space-y-2"
            >
              {editItems.map((item, index) => (
                <DraggableItem
                  key={item.id}
                  item={item}
                  index={index}
                  inputRef={(el) => { inputRefs.current[index] = el; }}
                  onChange={(value) => handleItemChange(item.id, value)}
                  onRemove={() => handleRemoveItem(item.id)}
                />
              ))}
            </Reorder.Group>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddItem}
              className="w-full mt-2 border-dashed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "rounded-lg border bg-muted/30 p-4",
              "transition-all duration-200",
              "hover:bg-muted/50 hover:border-muted-foreground/20",
              "cursor-pointer"
            )}
            onClick={() => setIsEditing(true)}
          >
            {items.length > 0 ? (
              <ul className="space-y-2.5">
                {items.map((item, index) => (
                  <li key={index} className="text-sm flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-muted-foreground italic">No items</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
