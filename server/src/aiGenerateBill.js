import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";


export default async function generateBill(imagePath) {
  const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
const base64ImageFile = fs.readFileSync(imagePath, {
  encoding: "base64",
});

const contents = [
  {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  { text: `You are an expert at extracting expense data from receipts. Analyze this bill receipt and extract individual purchasable items (not taxes, tips, or totals).

    For each item purchased, create a JSON object with:
    - "price": the individual item cost as a string (e.g., "12.99")
    - "description": a clear, concise item name (e.g., "Dove Body Wash 500ml")
    
    Rules:
    1. Only include actual products/services purchased
    2. Exclude taxes, service charges, tips, subtotals, and grand totals
    3. If quantity > 1, create separate objects for each unit
    4. Use the exact price shown for each item
    5. Keep descriptions concise but descriptive
    6. Format prices with 2 decimal places
    
    Example output:
    [
      {"price": "3.99", "description": "Coca Cola 2L"},
      {"price": "12.50", "description": "Chicken Sandwich"}
    ]
    
    Return only the JSON array, no markdown, no explanations, no trailing commas.` }
    
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
const data= response.text
return data
}