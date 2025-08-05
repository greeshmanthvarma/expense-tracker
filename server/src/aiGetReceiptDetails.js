import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import categories from "./categories.js";
import currencies from "./currencies.js";


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
  { text: `This is a receipt. Understand the details and give an expense json like this:
{
  "price": "123.45",
  "currency": "USD",
  "category": "Food & Dining",
  "description": "Starbucks coffee",
  "createdAt": "2024-07-10"
}
Use a value from this categories array: ${JSON.stringify(categories.map(c => c.value))} and this currencies array: ${JSON.stringify(currencies.map(c => c.value))}.
Output only the JSON object, nothing else. Do not include any markdown, comments, or trailing commas. Escape double quotes inside values using a backslash (\\") as per JSON standard.
` }
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
const data= response.text
return data
}