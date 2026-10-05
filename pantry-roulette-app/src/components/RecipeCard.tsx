"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Users,
  ChefHat,
  Lightbulb,
  Sparkles,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Recipe } from "@/lib/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onClose: () => void;
}

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-500/20 text-green-300 border-green-500/30",
  Medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Hard: "bg-red-500/20 text-red-300 border-red-500/30",
};

export function RecipeCard({ recipe, onClose }: RecipeCardProps) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="glass-card relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border/50 shadow-2xl"
        initial={{ scale: 0.8, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="relative overflow-hidden px-6 pt-6 pb-4">
          {/* Gradient header background */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/15 to-transparent" />

          <div className="relative">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                  <UtensilsCrossed className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" />
                  AI-Generated Recipe
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            <h2 className="text-2xl font-bold leading-tight text-foreground">
              {recipe.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>

            {/* Meta badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="gap-1 border border-border/50"
              >
                <Clock className="h-3 w-3" />
                {recipe.prepTime}
              </Badge>
              <Badge
                variant="secondary"
                className="gap-1 border border-border/50"
              >
                <Users className="h-3 w-3" />
                {recipe.servings}
              </Badge>
              <Badge
                className={`gap-1 border ${difficultyColors[recipe.difficulty] || difficultyColors.Easy}`}
              >
                <ChefHat className="h-3 w-3" />
                {recipe.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Scrollable content */}
        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-5 px-6 py-5">
            {/* Ingredients */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="inline-block h-1 w-4 rounded-full bg-primary" />
                Ingredients
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {recipe.ingredients.map((ing, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 rounded-xl bg-muted/30 px-3 py-2.5"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <span className="text-xs font-mono font-medium text-primary min-w-fit">
                      {ing.amount}
                    </span>
                    <span className="text-sm text-foreground">{ing.item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="inline-block h-1 w-4 rounded-full bg-accent" />
                Steps
              </h3>
              <div className="space-y-3">
                {recipe.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-card-foreground/80 pt-0.5">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            {recipe.tips && (
              <motion.div
                className="flex gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Lightbulb className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Pro Tip
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-amber-200/80">
                    {recipe.tips}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
