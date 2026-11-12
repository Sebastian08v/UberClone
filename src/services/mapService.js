const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

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
export async function getRoute(origin, destination) {
  const url =
    'https://maps.googleapis.com/maps/api/directions/json' +
    `?origin=${origin.latitude},${origin.longitude}` +
    `&destination=${destination.latitude},${destination.longitude}` +
    `&mode=driving&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== 'OK') {
    throw new Error(data.error_message || data.status);
  }

  const route = data.routes[0];
  const leg = route.legs[0];
  return {
    coordinates: decodePolyline(route.overview_polyline.points),
    distanceKm: Math.round(leg.distance.value / 100) / 10,
    durationMin: Math.round(leg.duration.value / 60),
  };
}