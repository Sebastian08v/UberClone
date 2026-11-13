const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_ROUTES_API_KEY;
import decodePolyline from '../utils/decodePolyline';
// origin y destination: { latitude, longitude }
// Usa Routes API (reemplazo de Directions API)
export async function getRoute(origin, destination) {
  const response = await fetch(
    'https://routes.googleapis.com/directions/v2:computeRoutes',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        // Solo pedimos los campos que usamos (obligatorio en Routes API)
        'X-Goog-FieldMask':
          'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline',
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: { latitude: origin.latitude, longitude: origin.longitude },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
          },
        },
        travelMode: 'DRIVE',
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `Error ${response.status}`);
  }
  if (!data.routes || data.routes.length === 0) {
    throw new Error('No se encontró una ruta');
  }

  const route = data.routes[0];
  return {
    coordinates: decodePolyline(route.polyline.encodedPolyline),
    encodedPolyline: route.polyline.encodedPolyline,
    distanceKm: Math.round(route.distanceMeters / 100) / 10,
    durationMin: Math.round(parseInt(route.duration, 10) / 60),
  };
}