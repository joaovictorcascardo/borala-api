async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
  const headers = { "User-Agent": "BoralaApp/1.0" };

  const attempts = [
    address,
    address.replace(/\s*-\s*[A-Z]{2}$/, "").trim(),
    address.split(",").slice(-2).join(",").trim(),
    address.split(",").pop()?.trim() ?? address,
  ];

  for (const query of attempts) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;
      const res = await fetch(url, { headers });
      const data = (await res.json()) as any[];
      if (data.length) return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } catch {
      continue;
    }
  }
  return null;
}

async function getRoute(
  origin: { lat: number; lon: number },
  dest: { lat: number; lon: number }
): Promise<{ distance: number; duration: number } | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?overview=false`;
    const res = await fetch(url);
    const data = (await res.json()) as any;
    if (data.code !== "Ok" || !data.routes?.length) return null;
    return data.routes[0];
  } catch {
    return null;
  }
}

export async function getRouteMetrics(originAddress: string, destAddress: string) {
  const [originCoords, destCoords] = await Promise.all([
    geocode(originAddress),
    geocode(destAddress),
  ]);

  if (!originCoords || !destCoords) {
    return { distance_km: null, duration_minutes: null, co2_saved_kg: null };
  }

  const route = await getRoute(originCoords, destCoords);
  if (!route) {
    return { distance_km: null, duration_minutes: null, co2_saved_kg: null };
  }

  const distance_km = Math.round(route.distance / 1000);
  const duration_minutes = Math.round(route.duration / 60);
  const co2_saved_kg = Math.round(distance_km * 0.21 * 10) / 10;

  return { distance_km, duration_minutes, co2_saved_kg };
}
