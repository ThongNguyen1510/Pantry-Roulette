import { z } from "zod";

// ─── Recipe Schema (Zod-enforced JSON structure) ──────────────────────────
// The AI must return a recipe matching this exact shape.

export const RecipeSchema = z.object({
  title: z.string().describe("A catchy, creative recipe name"),
  prepTime: z.string().describe("Estimated total time, e.g. '10 minutes'"),
  servings: z.string().describe("Number of servings, e.g. '2 servings'"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  description: z
    .string()
    .describe("A short 1-2 sentence description of the dish"),
  ingredients: z
    .array(
      z.object({
        item: z.string(),
        amount: z.string(),
      })
    )
    .describe("List of ingredients with approximate amounts"),
  steps: z
    .array(z.string())
    .describe("Numbered cooking steps, clear and concise"),
  tips: z.string().optional().describe("An optional pro tip for the dish"),
});

export type Recipe = z.infer<typeof RecipeSchema>;

// ─── AI Prompt Builder ────────────────────────────────────────────────────
export function buildRecipePrompt(combination: {
  protein: string;
  produce: string;
  flavor: string;
  style: string;
}): string {
  return `You are an expert home chef. Create a quick, delicious recipe based on these 4 constraints:

1. **Base/Protein**: ${combination.protein}
2. **Produce/Veggie**: ${combination.produce}
3. **Flavor/Sauce**: ${combination.flavor}
4. **Cooking Style**: ${combination.style}

Requirements:
- The recipe must be completable in 15 minutes or less
- Use the 4 specified ingredients/style as the foundation
- You may add basic pantry staples (salt, pepper, oil, etc.) but keep it simple
- Be creative with the recipe name
- Write clear, concise steps a beginner could follow
- Include approximate amounts for each ingredient

Return ONLY valid JSON matching this exact structure:
{
  "title": "string",
  "prepTime": "string",
  "servings": "string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "description": "string (1-2 sentences)",
  "ingredients": [{ "item": "string", "amount": "string" }],
  "steps": ["string"],
  "tips": "string (optional pro tip)"
}`;
}
