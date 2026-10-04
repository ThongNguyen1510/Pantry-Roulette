import { NextResponse } from "next/server";
import OpenAI from "openai";
import { RecipeSchema, buildRecipePrompt } from "@/lib/recipe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { protein, produce, flavor, style } = body;

    // Validate input
    if (!protein || !produce || !flavor || !style) {
      return NextResponse.json(
        { error: "All 4 ingredients/style are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Return a mock recipe for demo/development
      return NextResponse.json({
        recipe: {
          title: `${style} ${protein} with ${produce} & ${flavor}`,
          prepTime: "10 minutes",
          servings: "2 servings",
          difficulty: "Easy" as const,
          description: `A quick and delicious ${style.toLowerCase()} featuring ${protein.toLowerCase()} with fresh ${produce.toLowerCase()}, finished with ${flavor.toLowerCase()}.`,
          ingredients: [
            { item: protein, amount: "200g" },
            { item: produce, amount: "1 cup, chopped" },
            { item: flavor, amount: "2 tbsp" },
            { item: "Olive oil", amount: "1 tbsp" },
            { item: "Salt & pepper", amount: "To taste" },
            { item: "Garlic", amount: "2 cloves, minced" },
          ],
          steps: [
            `Prep all ingredients: dice the ${produce.toLowerCase()}, and prepare the ${protein.toLowerCase()}.`,
            `Heat olive oil in a pan over medium-high heat.`,
            `Add the ${protein.toLowerCase()} and cook for 3-4 minutes until golden.`,
            `Toss in the ${produce.toLowerCase()} and garlic, cook for 2 minutes.`,
            `Add the ${flavor.toLowerCase()} and toss everything together.`,
            `Season with salt and pepper, then serve immediately.`,
          ],
          tips: `For extra flavor, let the ${protein.toLowerCase()} marinate in the ${flavor.toLowerCase()} for 5 minutes before cooking.`,
        },
      });
    }

    const openai = new OpenAI({ apiKey });
    const prompt = buildRecipePrompt({ protein, produce, flavor, style });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful cooking assistant. Always respond with valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const parsed = JSON.parse(content);
    const validated = RecipeSchema.parse(parsed);

    return NextResponse.json({ recipe: validated });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
}
