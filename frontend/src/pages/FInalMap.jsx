import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Icons
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        if (!userId) {
          console.error('User not found.');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/selections/user/${userId}`);
        const userPlaces = response.data?.places || [];
        setLocations(userPlaces.filter(loc => loc.latitude && loc.longitude));
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

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

  const routeCoordinates = locations.map(loc => [loc.latitude, loc.longitude]);

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

        {routeCoordinates.length > 1 && (
          <Polyline positions={routeCoordinates} color="blue" weight={4} />
        )}
      </MapContainer>
    </div>
  );
}
