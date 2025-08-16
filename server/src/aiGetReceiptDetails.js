import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";



export default async function getReceiptDetails(imagePath) {
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
  { text: `You are an expert at extracting expense data from receipts. Analyze this receipt and create a single JSON object representing the main expense.

    Extract the following information:
    - "price": Total amount paid (exclude tips if separate, include taxes) as string with 2 decimals
    - "currency": Must be one of these exact values: "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "KRW", "SGD", "MXN", "BRL", "RUB", "ZAR", "BTC", "ETH". Default to "USD" if unclear.
    - "category": Must be one of these exact values: "Food & Dining", "Transportation", "Housing", "Shopping", "Entertainment", "Health & Fitness", "Travel", "Education", "Business", "Gifts & Donations", "Financial", "Other"
    - "description": Concise description of the main purchase (store name + primary item/service)
    - "createdAt": Date from receipt in YYYY-MM-DD format, or today's date if not visible
    
    Guidelines:
    1. Use the final total amount (after taxes, before tips)
    2. MUST choose currency and category from the exact lists above
    3. Keep description under 50 characters
    4. If multiple unrelated items, use the store name + "purchase"
    
    Example output:
    {"price": "23.45", "currency": "USD", "category": "Food & Dining", "description": "Starbucks coffee and pastry", "createdAt": "2024-07-10"}
    
    Return only the JSON object, no markdown, no explanations.` }
    
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
const data= response.text
return data
}