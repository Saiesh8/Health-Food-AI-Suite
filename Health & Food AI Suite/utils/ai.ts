import { AIMessage, ContentPart } from "@/types";

export async function generateAIResponse(
  messages: AIMessage[]
): Promise<string> {
  try {
    const response = await fetch("https://toolkit.rork.com/text/llm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`AI request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

export function createSystemPrompt(task: string): string {
  return `You are an expert AI assistant specializing in nutrition, food, cooking, and health analysis. 
Your task is to ${task}. 
Provide accurate, helpful, and detailed information.
Format your response in a clean, structured way that's easy to read.`;
}

export function createFoodValidationPrompt(imageBase64: string): AIMessage[] {
  return [
    {
      role: "system",
      content: createSystemPrompt(
        "analyze food images and determine if they contain food items"
      ),
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: 'Is this a food image? Please respond with "YES" if it contains food, or "NO" if it does not contain food. Then provide a brief explanation of what you see in the image.',
        },
        {
          type: "image",
          image: imageBase64,
        },
      ],
    },
  ];
}

export function createRecipeFromImagePrompt(imageBase64: string): AIMessage[] {
  return [
    {
      role: "system",
      content: createSystemPrompt(
        "generate detailed recipes based on food images"
      ),
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Create a detailed recipe based on this food image. Include title, ingredients with measurements, step-by-step instructions, nutritional information, and health benefits of key ingredients.",
        },
        {
          type: "image",
          image: imageBase64,
        },
      ],
    },
  ];
}

export function createRecipeFromIngredientsPrompt(
  ingredients: string
): AIMessage[] {
  return [
    {
      role: "system",
      content: createSystemPrompt(
        "generate creative and delicious recipes based on provided ingredients"
      ),
    },
    {
      role: "user",
      content: `Create a detailed recipe using these ingredients: ${ingredients}. Include title, complete ingredients list with measurements, step-by-step instructions, nutritional information, and health benefits of key ingredients.`,
    },
  ];
}

export function createMealPlanPrompt(
  goal: string,
  dietType: string,
  restrictions: string
): AIMessage[] {
  return [
    {
      role: "system",
      content: createSystemPrompt(
        "create personalized meal plans based on weight goals and dietary preferences"
      ),
    },
    {
      role: "user",
      content: `Create a 7-day meal plan for someone who wants to ${goal} weight. They follow a ${dietType} diet. Additional restrictions or preferences: ${restrictions}. Include breakfast, lunch, dinner, and snacks for each day. For each meal, provide a brief recipe with ingredients and instructions. Also include nutritional information and health benefits.`,
    },
  ];
}

export function createHealthAnalysisPrompt(
  imageBase64: string,
  analysisType: string
): AIMessage[] {
  return [
    {
      role: "system",
      content: createSystemPrompt(
        "analyze medical images and health reports to provide insights and dietary recommendations"
      ),
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Analyze this ${analysisType} image. Provide a detailed explanation of what you observe, potential health implications, and dietary recommendations based on the findings. Note: This is for educational purposes only and not a substitute for professional medical advice.`,
        },
        {
          type: "image",
          image: imageBase64,
        },
      ],
    },
  ];
}

export function createHealthReportAnalysisPrompt(
  reportText: string
): AIMessage[] {
  return [
    {
      role: "system",
      content: createSystemPrompt(
        "analyze health reports and provide dietary recommendations"
      ),
    },
    {
      role: "user",
      content: `Analyze this health report and provide dietary recommendations based on the findings. Report details: ${reportText}. Note: This is for educational purposes only and not a substitute for professional medical advice.`,
    },
  ];
}

export function parseRecipeFromAI(aiResponse: string): {
  title: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: { [key: string]: number };
  healthBenefits: string[];
} {
  // Default structure in case parsing fails
  const defaultRecipe = {
    title: "Recipe",
    ingredients: [],
    instructions: [],
    nutritionalInfo: {},
    healthBenefits: [],
  };

  try {
    // Extract title
    const titleMatch = aiResponse.match(/# (.+)|Title: (.+)/i);
    const title = titleMatch
      ? titleMatch[1] || titleMatch[2]
      : defaultRecipe.title;

    // Extract ingredients
    const ingredientsMatch = aiResponse.match(
      /## Ingredients([\s\S]*?)(?=## |$)/i
    );
    const ingredientsText = ingredientsMatch ? ingredientsMatch[1] : "";
    const ingredients = ingredientsText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./)
      )
      .map((line) => line.replace(/^-|\d+\.\s*/, "").trim())
      .filter(Boolean);

    // Extract instructions
    const instructionsMatch = aiResponse.match(
      /## Instructions([\s\S]*?)(?=## |$)/i
    );
    const instructionsText = instructionsMatch ? instructionsMatch[1] : "";
    const instructions = instructionsText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./)
      )
      .map((line) => line.replace(/^-|\d+\.\s*/, "").trim())
      .filter(Boolean);

    // Extract nutritional info
    const nutritionalInfoMatch = aiResponse.match(
      /## Nutritional Information([\s\S]*?)(?=## |$)/i
    );
    const nutritionalInfoText = nutritionalInfoMatch
      ? nutritionalInfoMatch[1]
      : "";
    const nutritionalInfo: { [key: string]: number } = {};

    const nutritionRegex = /(\w+):\s*(\d+)(?:\s*(\w+))?/g;
    let match;
    while ((match = nutritionRegex.exec(nutritionalInfoText)) !== null) {
      const key = match[1].toLowerCase();
      const value = parseInt(match[2], 10);
      nutritionalInfo[key] = value;
    }

    // Extract health benefits
    const healthBenefitsMatch = aiResponse.match(
      /## Health Benefits([\s\S]*?)(?=## |$)/i
    );
    const healthBenefitsText = healthBenefitsMatch
      ? healthBenefitsMatch[1]
      : "";
    const healthBenefits = healthBenefitsText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./)
      )
      .map((line) => line.replace(/^-|\d+\.\s*/, "").trim())
      .filter(Boolean);

    return {
      title,
      ingredients:
        ingredients.length > 0 ? ingredients : defaultRecipe.ingredients,
      instructions:
        instructions.length > 0 ? instructions : defaultRecipe.instructions,
      nutritionalInfo:
        Object.keys(nutritionalInfo).length > 0
          ? nutritionalInfo
          : defaultRecipe.nutritionalInfo,
      healthBenefits:
        healthBenefits.length > 0
          ? healthBenefits
          : defaultRecipe.healthBenefits,
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return defaultRecipe;
  }
}

export function parseMealPlanFromAI(aiResponse: string): {
  days: {
    day: string;
    meals: {
      type: string;
      title: string;
      description: string;
    }[];
  }[];
} {
  const defaultPlan = {
    days: [],
  };

  try {
    // Split by days
    const dayRegex = /## Day (\d+)|# Day (\d+)/g;
    const dayMatches = [...aiResponse.matchAll(dayRegex)];

    if (dayMatches.length === 0) return defaultPlan;

    const days = [];

    for (let i = 0; i < dayMatches.length; i++) {
      const currentMatch = dayMatches[i];
      const nextMatch = dayMatches[i + 1];

      if (!currentMatch.index) continue; // Skip if index is undefined

      const dayNumber = currentMatch[1] || currentMatch[2];
      const startIndex = currentMatch.index;
      const endIndex =
        nextMatch && nextMatch.index ? nextMatch.index : aiResponse.length;

      const dayContent = aiResponse.substring(startIndex, endIndex);

      // Extract meals
      const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
      const meals = [];

      for (const mealType of mealTypes) {
        const mealRegex = new RegExp(`### ${mealType}|## ${mealType}`, "i");
        const mealMatch = dayContent.match(mealRegex);

        if (mealMatch && mealMatch.index !== undefined) {
          const mealStartIndex = mealMatch.index;
          const nextMealType = mealTypes.find((type) => {
            const nextTypeRegex = new RegExp(`### ${type}|## ${type}`, "i");
            const nextTypeMatch = dayContent
              .substring(mealStartIndex + 1)
              .match(nextTypeRegex);
            return nextTypeMatch !== null;
          });

          let mealEndIndex;
          if (nextMealType) {
            const nextMealRegex = new RegExp(
              `### ${nextMealType}|## ${nextMealType}`,
              "i"
            );
            const nextMealMatch = dayContent
              .substring(mealStartIndex + 1)
              .match(nextMealRegex);
            if (nextMealMatch && nextMealMatch.index !== undefined) {
              mealEndIndex = mealStartIndex + 1 + nextMealMatch.index;
            } else {
              mealEndIndex = dayContent.length;
            }
          } else {
            mealEndIndex = dayContent.length;
          }

          const mealContent = dayContent.substring(
            mealStartIndex,
            mealEndIndex
          );

          // Extract title and description
          const titleMatch = mealContent.match(/\*\*(.*?)\*\*|_(.*?)_/);
          const title = titleMatch ? titleMatch[1] || titleMatch[2] : mealType;

          // Everything after the title is the description
          let description = mealContent;
          if (titleMatch && titleMatch.index !== undefined) {
            description = mealContent.substring(
              titleMatch.index + titleMatch[0].length
            );
          }
          description = description
            .replace(new RegExp(`### ${mealType}|## ${mealType}`, "i"), "")
            .trim();

          meals.push({
            type: mealType.toLowerCase(),
            title,
            description,
          });
        }
      }

      days.push({
        day: `Day ${dayNumber}`,
        meals,
      });
    }

    return { days };
  } catch (error) {
    console.error("Error parsing AI meal plan response:", error);
    return defaultPlan;
  }
}

export function parseHealthAnalysisFromAI(aiResponse: string): {
  findings: string;
  recommendations: string[];
  dietRecommendations: string[];
} {
  const defaultAnalysis = {
    findings: "",
    recommendations: [],
    dietRecommendations: [],
  };

  try {
    // Extract findings
    const findingsMatch = aiResponse.match(
      /## Findings|# Findings([\s\S]*?)(?=## |# |$)/i
    );
    const findings = findingsMatch ? findingsMatch[1].trim() : "";

    // If no structured findings section, use the first paragraph
    const firstParagraph = aiResponse.split("\n\n")[0];

    // Extract recommendations
    const recommendationsMatch = aiResponse.match(
      /## Recommendations|# Recommendations([\s\S]*?)(?=## |# |$)/i
    );
    const recommendationsText = recommendationsMatch
      ? recommendationsMatch[1]
      : "";
    const recommendations = recommendationsText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./)
      )
      .map((line) => line.replace(/^-|\d+\.\s*/, "").trim())
      .filter(Boolean);

    // Extract dietary recommendations
    const dietMatch = aiResponse.match(
      /## Dietary Recommendations|# Dietary|## Diet([\s\S]*?)(?=## |# |$)/i
    );
    const dietText = dietMatch ? dietMatch[1] : "";
    const dietRecommendations = dietText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("-") || line.trim().match(/^\d+\./)
      )
      .map((line) => line.replace(/^-|\d+\.\s*/, "").trim())
      .filter(Boolean);

    return {
      findings: findings || firstParagraph || defaultAnalysis.findings,
      recommendations:
        recommendations.length > 0
          ? recommendations
          : defaultAnalysis.recommendations,
      dietRecommendations:
        dietRecommendations.length > 0
          ? dietRecommendations
          : defaultAnalysis.dietRecommendations,
    };
  } catch (error) {
    console.error("Error parsing AI health analysis response:", error);
    return defaultAnalysis;
  }
}
