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
export const getLatLonFromGemini = async (name, address = "") => {
  if (!name) return { latitude: null, longitude: null };

const prompt = `
You are a geocoding assistant. Given a place name and its full address details, return the exact latitude and longitude coordinates.

Return only valid JSON in the following format:
{
  "latitude": 12.3456,
  "longitude": 78.9012
}

Place name: ${name}
Address: ${address}
State: Karnataka
Country: India

Please ensure the coordinates are precise and specific to this location, not a general city center.
`;



  try {
    const result = await model.generateContent(prompt);
    const text = (await result.response.text()).trim();

    console.log("Gemini raw response:", text);  // For debugging

    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No JSON object found in Gemini response");
    }

    const jsonString = text.substring(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonString);

    return {
      latitude: typeof parsed.latitude === 'number' ? parsed.latitude : null,
      longitude: typeof parsed.longitude === 'number' ? parsed.longitude : null,
    };
  } catch (err) {
    console.error('[Gemini Geocoding Error]', err.message);
    return { latitude: null, longitude: null };
  }
};
