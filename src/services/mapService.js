const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_ROUTES_API_KEY;

// Convierte el texto comprimido de Google en una lista de coordenadas
function decodePolyline(encoded) {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const points = [];

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

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
    distanceKm: Math.round(route.distanceMeters / 100) / 10,
    // La duración llega como texto, por ejemplo "1320s"
    durationMin: Math.round(parseInt(route.duration, 10) / 60),
  };
}