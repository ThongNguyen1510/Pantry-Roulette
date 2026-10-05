"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, ChefHat, Loader2, RotateCcw, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Reel } from "@/components/Reel";
import { RecipeCard } from "@/components/RecipeCard";
import { PantryDrawer } from "@/components/PantryDrawer";
import { useSlotMachine } from "@/hooks/useSlotMachine";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { REEL_CATEGORIES, getDefaultPantry } from "@/lib/ingredients";
import { sounds } from "@/lib/sounds";
import type { Recipe } from "@/lib/recipe";

function fireConfetti() {
  const defaults = {
    spread: 360,
    ticks: 80,
    gravity: 0.8,
    decay: 0.92,
    startVelocity: 25,
    colors: ["#FF6B35", "#4ECDC4", "#FFD93D", "#C084FC", "#F472B6"],
  };

  confetti({ ...defaults, particleCount: 40, origin: { x: 0.3, y: 0.6 } });
  confetti({ ...defaults, particleCount: 40, origin: { x: 0.7, y: 0.6 } });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 30,
      origin: { x: 0.5, y: 0.5 },
      startVelocity: 35,
    });
  }, 150);
}

export function SlotMachine() {
  const [pantry, setPantry] = useLocalStorage<Record<string, boolean>>(
    "pantry-roulette-pantry",
    getDefaultPantry()
  );

  const {
    reels,
    isSpinning,
    hasResult,
    spin,
    toggleLock,
    reset,
    getCurrentCombination,
    getAvailableItems,
  } = useSlotMachine(pantry);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecipe, setShowRecipe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fire confetti when result lands
  useEffect(() => {
    if (hasResult) {
      fireConfetti();
      sounds.victory();
    }
  }, [hasResult]);

  const handleSpin = useCallback(() => {
    setRecipe(null);
    setShowRecipe(false);
    setError(null);
    sounds.spinStart();
    spin();
  }, [spin]);

  const handleGenerateRecipe = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    const combination = getCurrentCombination();
    const payload = {
      protein: combination[0].ingredient,
      produce: combination[1].ingredient,
      flavor: combination[2].ingredient,
      style: combination[3].ingredient,
    };

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe");
      }

      setRecipe(data.recipe);
      setShowRecipe(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [getCurrentCombination]);

  const handleReset = useCallback(() => {
    setRecipe(null);
    setShowRecipe(false);
    setError(null);
    reset();
  }, [reset]);

  return (
    <div className="relative flex min-h-screen flex-col items-center px-4 py-8 sm:py-12">
      {/* Ambient background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[128px]" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-accent/5 blur-[128px]" />
        <div className="absolute right-1/3 top-1/3 h-64 w-64 rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <motion.header
        className="relative z-10 mb-10 flex flex-col items-center text-center sm:mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 shadow-lg shadow-primary/10"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Dices className="h-8 w-8 text-primary" />
        </motion.div>
        <h1 className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          Pantry Roulette
        </h1>
        <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
          Spin the reels. Lock your faves. Let AI cook up something amazing.
        </p>

        {/* Pantry drawer trigger */}
        <div className="mt-5">
          <PantryDrawer pantry={pantry} onPantryChange={setPantry} />
        </div>
      </motion.header>

      {/* Slot Machine */}
      <div className="relative z-10 w-full max-w-3xl">
        {/* Machine frame */}
        <motion.div
          className="glass-card rounded-3xl p-6 shadow-2xl sm:p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Reels grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {reels.map((reel, index) => {
              const category = REEL_CATEGORIES.find(
                (c) => c.id === reel.categoryId
              )!;
              return (
                <Reel
                  key={reel.categoryId}
                  category={category}
                  currentItem={reel.currentItem}
                  isLocked={reel.isLocked}
                  isSpinning={reel.isSpinning}
                  availableItems={getAvailableItems(reel.categoryId)}
                  onToggleLock={() => toggleLock(index)}
                  index={index}
                />
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <Sparkles className="h-4 w-4 text-muted-foreground/50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {/* Main Spin Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={handleSpin}
                disabled={isSpinning}
                size="lg"
                className="relative min-w-[200px] gap-2 rounded-full bg-gradient-to-r from-primary to-orange-600 px-8 py-6 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
              >
                {isSpinning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Spinning...
                  </>
                ) : (
                  <>
                    <Dices className="h-5 w-5" />
                    {hasResult ? "Spin Again" : "SPIN!"}
                  </>
                )}
                {/* Glow effect */}
                {!isSpinning && (
                  <span className="absolute inset-0 rounded-full animate-pulse-glow" />
                )}
              </Button>
            </motion.div>

            {/* Generate Recipe Button (appears after spin) */}
            <AnimatePresence>
              {hasResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Button
                    onClick={handleGenerateRecipe}
                    disabled={isGenerating}
                    size="lg"
                    variant="secondary"
                    className="gap-2 rounded-full border border-accent/30 bg-accent/10 px-6 py-6 text-base font-semibold text-accent hover:bg-accent/20"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Cooking...
                      </>
                    ) : (
                      <>
                        <ChefHat className="h-5 w-5" />
                        Get Recipe
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reset Button */}
            <AnimatePresence>
              {hasResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="lg"
                    className="gap-1.5 rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-4 rounded-xl bg-destructive/10 border border-destructive/30 p-3 text-center text-sm text-destructive"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Current combo display (when result is shown) */}
        <AnimatePresence>
          {hasResult && (
            <motion.div
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              {getCurrentCombination().map((item, i) => (
                <motion.span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-card/50 border border-border/30 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className="text-foreground">{item.ingredient}</span>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recipe Card Modal */}
      <AnimatePresence>
        {showRecipe && recipe && (
          <RecipeCard recipe={recipe} onClose={() => setShowRecipe(false)} />
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer
        className="relative z-10 mt-auto pt-12 pb-6 text-center text-xs text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p>
          Built with 🎰 by Pantry Roulette &middot; Reduce waste, cook smart
        </p>
      </motion.footer>
    </div>
  );
}
