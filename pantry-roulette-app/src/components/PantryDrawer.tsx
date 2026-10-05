"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { REEL_CATEGORIES, getDefaultPantry } from "@/lib/ingredients";

interface PantryDrawerProps {
  pantry: Record<string, boolean>;
  onPantryChange: (pantry: Record<string, boolean>) => void;
}

export function PantryDrawer({ pantry, onPantryChange }: PantryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (itemId: string) => {
    onPantryChange({
      ...pantry,
      [itemId]: !pantry[itemId],
    });
  };

  const handleResetAll = () => {
    onPantryChange(getDefaultPantry());
  };

  const handleToggleCategory = (categoryId: string, enabled: boolean) => {
    const category = REEL_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return;
    const updated = { ...pantry };
    category.items.forEach((item) => {
      updated[item.id] = enabled;
    });
    onPantryChange(updated);
  };

  const totalItems = REEL_CATEGORIES.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );
  const enabledItems = Object.values(pantry).filter(Boolean).length;

  return (
    <Sheet>
      <SheetTrigger className="flex cursor-pointer items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:scale-[1.03] hover:border-primary/30 hover:text-foreground active:scale-[0.97]">
          <Package className="h-4 w-4" />
          My Pantry
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
            {enabledItems}/{totalItems}
          </span>
      </SheetTrigger>

      <SheetContent className="w-full border-l-border/30 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-primary" />
            My Pantry
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Toggle off ingredients you&apos;re out of. The slot machine will
            only land on items you have.
          </p>
        </SheetHeader>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        {/* Reset button */}
        <div className="mb-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-260px)]">
          <div className="space-y-6 pr-4">
            {REEL_CATEGORIES.map((category) => {
              const filteredItems = category.items.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              const categoryEnabled = category.items.every(
                (item) => pantry[item.id] !== false
              );

              return (
                <div key={category.id}>
                  {/* Category header */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <h3 className="text-sm font-semibold text-foreground">
                        {category.label}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {
                          category.items.filter(
                            (item) => pantry[item.id] !== false
                          ).length
                        }
                        /{category.items.length}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleCategory(category.id, !categoryEnabled)
                      }
                      className="text-xs font-medium text-primary hover:text-primary/80"
                    >
                      {categoryEnabled ? "Disable All" : "Enable All"}
                    </button>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/30"
                        whileHover={{ x: 2 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{item.emoji}</span>
                          <span
                            className={`text-sm font-medium transition-colors ${
                              pantry[item.id] !== false
                                ? "text-foreground"
                                : "text-muted-foreground line-through"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                        <Switch
                          checked={pantry[item.id] !== false}
                          onCheckedChange={() => handleToggle(item.id)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <Separator className="mt-4 opacity-30" />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
