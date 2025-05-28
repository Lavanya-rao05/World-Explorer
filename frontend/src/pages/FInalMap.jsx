import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Custom Icons
const placeIcon = new L.Icon({
  iconUrl: '/icons/place.png',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const restaurantIcon = new L.Icon({
  iconUrl: '/icons/restaurant.png',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const hotelIcon = new L.Icon({
  iconUrl: '/icons/hotel.png',
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

export default function FinalMap() {
  const [locations, setLocations] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user places
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        if (!userId) {
          console.error('User not found.');
          return;
        }

        const response = await axios.get(`https://qw3js3n6-5000.inc1.devtunnels.ms/api/selections/user/${userId}`);
        const userPlaces = response.data?.places || [];
        const filtered = userPlaces.filter(loc => loc.latitude && loc.longitude);
        setLocations(filtered);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Fetch proper road route
  useEffect(() => {
    const fetchRoute = async () => {
      if (locations.length < 2) return;

      const coords = locations.map(loc => [loc.longitude, loc.latitude]);

      try {
        const res = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          { coordinates: coords },
          {
            headers: {
              Authorization: '5b3ce3597851110001cf624894fd3914cb054462b18d00c5d1eb7b13', // 🚨 Replace this
              'Content-Type': 'application/json',
            },
          }
        );

        const routeGeoJSON = res.data;
        const lineCoords = routeGeoJSON.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoutePolyline(lineCoords);
      } catch (err) {
        console.error('Error fetching driving route:', err);
      }
    };

    fetchRoute();
  }, [locations]);

  if (loading) return <div className="text-center mt-10 text-lg">Loading map data...</div>;

  const getIcon = (category) => {
    switch (category) {
      case 'restaurant': return restaurantIcon;
      case 'hotel': return hotelIcon;
      default: return placeIcon;
    }
  };

  const center = locations.length > 0
    ? [locations[0].latitude, locations[0].longitude]
    : [12.9141, 74.8560]; // Default to Mangalore

  const openGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-screen w-full">
      <MapContainer center={center} zoom={13} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {locations.map((loc, i) => (
          <Marker
            key={`${loc.category}-${i}`}
            position={[loc.latitude, loc.longitude]}
            icon={getIcon(loc.category)}
            eventHandlers={{
              click: () => openGoogleMaps(loc.latitude, loc.longitude),
            }}
          >
            <Popup>
              <strong>{loc.name}</strong><br />
              <em>{loc.category}</em><br />
              <span>Click marker to open Google Maps</span>
            </Popup>
            <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent>
              {loc.name}
            </Tooltip>
          </Marker>
        ))}

        {routePolyline && (
          <Polyline positions={routePolyline} color="blue" weight={5} />
        )}
      </MapContainer>
    </div>
  );
}
