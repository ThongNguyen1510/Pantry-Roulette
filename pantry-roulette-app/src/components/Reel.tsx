"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Ingredient, ReelCategory } from "@/lib/ingredients";
import { sounds } from "@/lib/sounds";

interface ReelProps {
  category: ReelCategory;
  currentItem: Ingredient;
  isLocked: boolean;
  isSpinning: boolean;
  availableItems: Ingredient[];
  onToggleLock: () => void;
  index: number;
}

export function Reel({
  category,
  currentItem,
  isLocked,
  isSpinning,
  availableItems,
  onToggleLock,
  index,
}: ReelProps) {
  const [displayItems, setDisplayItems] = useState<Ingredient[]>([currentItem]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevSpinning = useRef(false);

  // When spinning, rapidly cycle through available items
  useEffect(() => {
    if (isSpinning && !isLocked) {
      let idx = 0;
      intervalRef.current = setInterval(() => {
        idx = (idx + 1) % availableItems.length;
        setDisplayItems([availableItems[idx]]);
      }, 80);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayItems([currentItem]);

      // Play stop sound when transitioning from spinning to stopped
      if (prevSpinning.current && !isSpinning) {
        sounds.reelStop();
      }
    }

    prevSpinning.current = isSpinning && !isLocked;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSpinning, isLocked, availableItems, currentItem]);

  const handleLockClick = useCallback(() => {
    sounds.lock();
    onToggleLock();
  }, [onToggleLock]);

  const displayItem = displayItems[0];

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
    >
      {/* Category label */}
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        {category.label}
      </div>

      {/* Reel display */}
      <motion.div
        className={cn(
          "relative flex h-36 w-32 flex-col items-center justify-center rounded-2xl border-2 transition-colors duration-300",
          "sm:h-40 sm:w-36 md:h-44 md:w-40",
          isLocked
            ? "border-primary/60 bg-primary/10"
            : "border-border bg-card/50",
          isSpinning && !isLocked && "border-primary/30"
        )}
        animate={
          isSpinning && !isLocked
            ? {
                borderColor: [
                  "oklch(0.28 0.03 280)",
                  "oklch(0.75 0.18 30 / 50%)",
                  "oklch(0.28 0.03 280)",
                ],
              }
            : {}
        }
        transition={
          isSpinning && !isLocked
            ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      >
        {/* Lock badge */}
        {isLocked && (
          <motion.div
            className="absolute -top-2 -right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Lock className="h-3 w-3" />
          </motion.div>
        )}

        {/* Spinning blur overlay */}
        {isSpinning && !isLocked && (
          <motion.div
            className="absolute inset-0 z-10 rounded-2xl"
            style={{
              background: `linear-gradient(180deg, ${category.color}10, transparent, ${category.color}10)`,
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
        )}

        {/* Item display */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={displayItem.id + (isSpinning ? Math.random() : "")}
            className="flex flex-col items-center justify-center gap-1 px-3 text-center"
            initial={isSpinning && !isLocked ? { y: -40, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={isSpinning && !isLocked ? { y: 40, opacity: 0 } : undefined}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.15,
            }}
          >
            <span className="text-4xl sm:text-5xl">{displayItem.emoji}</span>
            <span className="mt-1 text-sm font-semibold leading-tight text-card-foreground sm:text-base">
              {displayItem.name}
            </span>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Lock/Unlock button */}
      <motion.button
        onClick={handleLockClick}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
          isLocked
            ? "bg-primary/20 text-primary hover:bg-primary/30"
            : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isSpinning}
      >
        {isLocked ? (
          <>
            <Lock className="h-3 w-3" />
            Locked
          </>
        ) : (
          <>
            <Unlock className="h-3 w-3" />
            Hold
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
