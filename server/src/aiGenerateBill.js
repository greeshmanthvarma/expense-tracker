import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";


export default async function generateBill(imagePath) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
    {
      text: `You are an expert at extracting expense data from receipts. Analyze this bill receipt and extract individual purchasable items with taxes proportionally distributed.

    For each item purchased, create a JSON object with:
    - "price": item cost INCLUDING proportional tax as string (e.g., "12.99")
    - "description": clear, concise item name (e.g., "Dove Body Wash 500ml")
    
    Rules:
    1. INCLUDE taxes proportionally distributed across items
    2. Calculate: (item_subtotal / subtotal_before_tax) * total_tax, then add to item price
    3. Exclude service charges, tips, and delivery fees
    4. If quantity > 1, create separate objects for each unit
    5. Final sum of all item prices should equal total bill amount (minus tips/service fees)
    6. Keep descriptions concise but descriptive
    7. Format prices with 2 decimal places
    
    Example:
    If Pizza = $10, Drinks = $5, Subtotal = $15, Tax = $1.50, Total = $16.50
    Output:
    [
      {"price": "11.00", "description": "Pizza"}, // $10 + ($10/$15 * $1.50)
      {"price": "5.50", "description": "Drinks"}  // $5 + ($5/$15 * $1.50)
    ]
    
    Return only the JSON array, no markdown, no explanations, no trailing commas.` }

  ];

  const contents2 = [{
    inlineData: {
      mimeType: "image/jpeg",
      data: base64ImageFile,
    },
  },
  {
    text: `You are an expert at extracting expense data from receipts. Analyze this receipt and extract the total bill information.

    Extract the following:
    - "totalAmount": Final total paid (include taxes, exclude tips) as string with 2 decimals
    - "description": Vendor name + brief purchase summary (max 40 characters)
    - "date": Receipt date in YYYY-MM-DD format, or today's date if not visible
    
    Rules:
    1. Use the final total amount after taxes
    2. Keep description format: "Vendor Name - Item type" 
    3. If multiple items, use general category (e.g., "Walmart - Groceries")
    4. Format price exactly with 2 decimal places
    
    Example output:
    {"totalAmount": "23.45", "description": "Starbucks - Coffee & pastry", "date": "2024-01-15"}
    
    Return only the JSON array, no markdown, no explanations, no trailing commas.`
    }


  ]
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
  });

  const response2 = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents2,
  });

  const itemDetails = response.text
  const billDetails = response2.text
  return ({ itemDetails, billDetails })
}