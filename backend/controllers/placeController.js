import axios from 'axios';
import { categorizePlaces } from './gemini.js';

export const getPlacesByQuery = async (req, res) => {
  const {
    textQuery,
    latitude,
    longitude,
    radius = '50000',
    languageCode = 'en',
    regionCode = 'en',
    openNow = 'false',
  } = req.query;

  if (!textQuery || !latitude || !longitude) {
    return res.status(400).json({
      error: 'Please provide textQuery, latitude, and longitude parameters.',
    });
  }

  const location = `${latitude},${longitude}`;

  const params = new URLSearchParams({
    query: textQuery,
    radius,
    opennow: openNow,
    location,
    language: languageCode,
    region: regionCode,
  });

  const url = `https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json?${params.toString()}`;

  const options = {
    method: 'GET',
    url,
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY,
      'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const rawPlaces = response.data.results;

    // Build lookup map
    const placeMap = {};
    const simplifiedPlaces = rawPlaces.map(place => {
      const photoRef = place.photos?.[0]?.photo_reference || null;
      const photoUrl = photoRef
        ? `https://google-map-places.p.rapidapi.com/maps/api/place/photo?photo_reference=${photoRef}&maxwidth=400`
        : null;

      placeMap[place.place_id] = {
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        photo_url: photoUrl,
      };

      return {
        place_id: place.place_id,
        name: place.name,
        types: place.types,
      };
    });

    // Get categories from Gemini
    const categorizedPlaces = await categorizePlaces(simplifiedPlaces);

    // Final merge
    const finalPlaces = categorizedPlaces.map(place => {
      const meta = placeMap[place.place_id] || {};
      return {
        place_id: place.place_id,
        category: place.category,
        name: meta.name || place.name,
        address: meta.address || '',
        rating: meta.rating || null,
        user_ratings_total: meta.user_ratings_total || 0,
        photo_url: meta.photo_url || null,
      };
    });

    res.json({ categorizedPlaces: finalPlaces });
  } catch (error) {
    console.error('[Places Controller Error]', error?.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
