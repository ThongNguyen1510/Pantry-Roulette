# 🎰 Pantry Roulette

> A gamified, constraint-based cooking web application that tackles dinner decision paralysis.

Spin the 4-reel slot machine to randomize ingredients across four culinary categories (Base/Protein, Produce/Veggie, Flavor/Sauce, and Cooking Style), lock down ingredients you have, and instantly generate cohesive, chef-crafted recipes with AI!

---

## ✨ Features

- 🎰 **4-Reel Slot Machine**: Distinct reels for Base/Protein, Produce/Veggie, Flavor Profile, and Cooking Style with fluid animations and realistic audio effects.
- 🔒 **Hold & Lock System**: Lock specific reels (e.g., Chicken & Rice) and spin the rest to find the perfect flavor combination and cooking technique.
- 🥫 **Interactive Pantry Drawer**: Manage your custom ingredients, toggle items in/out of rotation, and add custom culinary elements.
- 👨‍🍳 **AI Recipe Generation**: Instant structured recipe cards with prep/cook times, difficulty ratings, step-by-step instructions, and pro chef tips.
- 🔊 **Web Audio Synthesizer**: Built-in sound design with retro spin clicks, reel stops, and jackpot chimes (toggleable).
- 🌓 **Modern Dark Aesthetic**: Sleek glassmorphic dark theme built with Tailwind CSS, Lucide icons, and Framer Motion.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Navigate to the app directory
cd pantry-roulette-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience Pantry Roulette!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router) & React 19
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Animation**: Framer Motion
- **UI Components**: Radix UI Primitives (Sheet, ScrollArea, Switch, Badge, Separator)
- **Audio**: Web Audio API (Synthesized SFX)