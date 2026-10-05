"use client";

import { useState, useCallback, useRef } from "react";
import { REEL_CATEGORIES, type Ingredient } from "@/lib/ingredients";

export interface ReelState {
  categoryId: string;
  currentItem: Ingredient;
  isLocked: boolean;
  isSpinning: boolean;
}

export interface SlotMachineState {
  reels: ReelState[];
  isSpinning: boolean;
  hasResult: boolean;
}

export function useSlotMachine(pantry: Record<string, boolean>) {
  // Initialize each reel with the first available ingredient
  const getInitialReels = useCallback((): ReelState[] => {
    return REEL_CATEGORIES.map((cat) => {
      const available = cat.items.filter((item) => pantry[item.id] !== false);
      return {
        categoryId: cat.id,
        currentItem: available[0] || cat.items[0],
        isLocked: false,
        isSpinning: false,
      };
    });
  }, [pantry]);

  const [reels, setReels] = useState<ReelState[]>(getInitialReels);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const spinTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Get available items for a category based on pantry
  const getAvailableItems = useCallback(
    (categoryId: string): Ingredient[] => {
      const category = REEL_CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return [];
      const available = category.items.filter(
        (item) => pantry[item.id] !== false
      );
      return available.length > 0 ? available : category.items;
    },
    [pantry]
  );

  // Pick a random item from available items (excluding current to avoid repeats)
  const pickRandom = useCallback(
    (categoryId: string, currentId?: string): Ingredient => {
      const available = getAvailableItems(categoryId);
      if (available.length <= 1) return available[0];
      let pick: Ingredient;
      do {
        pick = available[Math.floor(Math.random() * available.length)];
      } while (pick.id === currentId && available.length > 1);
      return pick;
    },
    [getAvailableItems]
  );

  // Toggle lock on a specific reel
  const toggleLock = useCallback(
    (reelIndex: number) => {
      if (isSpinning) return;
      setReels((prev) =>
        prev.map((reel, i) =>
          i === reelIndex ? { ...reel, isLocked: !reel.isLocked } : reel
        )
      );
    },
    [isSpinning]
  );

  // Main spin function
  const spin = useCallback(() => {
    if (isSpinning) return;

    // Clear any pending timeouts
    spinTimeouts.current.forEach(clearTimeout);
    spinTimeouts.current = [];

    setIsSpinning(true);
    setHasResult(false);

    // Mark unlocked reels as spinning
    setReels((prev) =>
      prev.map((reel) => ({
        ...reel,
        isSpinning: !reel.isLocked,
      }))
    );

    // Stagger stop times: each reel stops later for dramatic effect
    const baseDuration = 1200; // ms
    const stagger = 400; // ms between each reel stopping

    REEL_CATEGORIES.forEach((_, index) => {
      const stopDelay = baseDuration + index * stagger;

      const timeout = setTimeout(() => {
        setReels((prev) =>
          prev.map((reel, i) => {
            if (i !== index || reel.isLocked) return reel;
            return {
              ...reel,
              currentItem: pickRandom(reel.categoryId, reel.currentItem.id),
              isSpinning: false,
            };
          })
        );

        // After the last reel stops, mark as complete
        if (index === REEL_CATEGORIES.length - 1) {
          setTimeout(() => {
            setIsSpinning(false);
            setHasResult(true);
          }, 200);
        }
      }, stopDelay);

      spinTimeouts.current.push(timeout);
    });
  }, [isSpinning, pickRandom]);

  // Reset all reels
  const reset = useCallback(() => {
    spinTimeouts.current.forEach(clearTimeout);
    spinTimeouts.current = [];
    setReels(getInitialReels());
    setIsSpinning(false);
    setHasResult(false);
  }, [getInitialReels]);

  // Get the current combination as a readable array
  const getCurrentCombination = useCallback(() => {
    return reels.map((reel) => ({
      category: REEL_CATEGORIES.find((c) => c.id === reel.categoryId)?.label || "",
      ingredient: reel.currentItem.name,
    }));
  }, [reels]);

  return {
    reels,
    isSpinning,
    hasResult,
    spin,
    toggleLock,
    reset,
    getCurrentCombination,
    getAvailableItems,
  };
}
