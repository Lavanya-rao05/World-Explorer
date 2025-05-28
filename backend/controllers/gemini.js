import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const categorizePlaces = async (places) => {
  const prompt = `
You are an intelligent assistant. Given a list of tourist places with place_id, name, and types, categorize each into one of the following types:

- museum
- park
- beach
- amusement park
- temple
- historical site
- art gallery
- aquarium
- fort
- palace
- garden
- zoo
- other (if it doesn't fit above)

Return a JSON array in this exact format:
[
  { "place_id": "abc123", "category": "park" },
  ...
]

Only return valid JSON and nothing else.

Here is the input data:
${JSON.stringify(places, null, 2)}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Defensive parsing
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    const jsonString = text.substring(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (err) {
    console.error('[Gemini Error]', err.message);
    return [];
  }
};
