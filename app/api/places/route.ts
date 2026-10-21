import { NextRequest, NextResponse } from 'next/server';

interface NormalizedPlace {
  name: string;
  city?: string;
  country?: string;
  address?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  type?: 'city' | 'venue' | 'civic' | 'custom';
}

const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.GOOGLE_MAPS_API_KEY ||
  'AIzaSyAa0-KtQjJYuBpzMyPVrMGFLBQKbGeUCxo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || searchParams.get('q') || '';
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');

    // 1. Nearby Search by GPS Coordinates (Instagram "Current Location" Mode)
    if (latStr && lngStr) {
      const latitude = parseFloat(latStr);
      const longitude = parseFloat(lngStr);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        try {
          const nearbyRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
              'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.id,places.location',
            },
            body: JSON.stringify({
              locationRestriction: {
                circle: {
                  center: { latitude, longitude },
                  radius: 2500.0,
                },
              },
              maxResultCount: 12,
            }),
          });

          if (nearbyRes.ok) {
            const data = await nearbyRes.json();
            const places: NormalizedPlace[] = (data.places || []).map((p: any) => ({
              name: p.displayName?.text || p.formattedAddress || 'Nearby Location',
              address: p.formattedAddress || '',
              lat: p.location?.latitude ?? latitude,
              lng: p.location?.longitude ?? longitude,
              placeId: p.id,
              type: 'venue',
            }));

            if (places.length > 0) {
              return NextResponse.json({
                results: places,
                provider: 'google_places_nearby',
              });
            }
          }
        } catch (nearbyErr) {
          console.warn('[Places API Nearby Error]', nearbyErr);
        }
      }
    }

    // 2. Autocomplete Search by Query using Google Places API (New)
    const trimmed = query.trim();
    if (!trimmed) {
      return NextResponse.json({ results: [] });
    }

    try {
      const autocompleteRes = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
        },
        body: JSON.stringify({
          input: trimmed,
        }),
      });

      if (autocompleteRes.ok) {
        const data = await autocompleteRes.json();
        const suggestions = data.suggestions || [];

        const places: NormalizedPlace[] = suggestions.map((s: any) => {
          const pred = s.placePrediction;
          const mainText = pred?.structuredFormat?.mainText?.text || pred?.text?.text || trimmed;
          const secondaryText = pred?.structuredFormat?.secondaryText?.text || '';
          
          return {
            name: mainText,
            address: secondaryText || undefined,
            placeId: pred?.placeId,
            type: 'venue',
          };
        });

        if (places.length > 0) {
          return NextResponse.json({
            results: places,
            provider: 'google_places_new',
          });
        }
      } else {
        const errText = await autocompleteRes.text();
        console.warn('[Places API New HTTP Error]', autocompleteRes.status, errText);
      }
    } catch (apiErr) {
      console.warn('[Places API Error]', apiErr);
    }

    // 3. Fallback: OpenStreetMap Nominatim for resiliency if Google API is unavailable
    try {
      const nominatimRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmed
        )}&addressdetails=1&limit=8`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Zenvitra-Pulse/1.0',
          },
        }
      );

      if (nominatimRes.ok) {
        const nomData = await nominatimRes.json();
        const nomPlaces: NormalizedPlace[] = nomData.map((item: any) => {
          const addr = item.address || {};
          const cityName = addr.city || addr.town || addr.village || addr.state || '';
          const countryName = addr.country || '';
          const parts = item.display_name.split(',');
          const mainName = parts[0]?.trim() || item.name || trimmed;
          const subAddr = parts.slice(1, 4).join(',').trim();

          return {
            name: mainName,
            address: subAddr || `${cityName}${countryName ? ', ' + countryName : ''}`,
            city: cityName,
            country: countryName,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: 'city',
          };
        });

        return NextResponse.json({
          results: nomPlaces,
          provider: 'nominatim_fallback',
        });
      }
    } catch (nomErr) {
      console.warn('[Nominatim Fallback Error]', nomErr);
    }

    return NextResponse.json({ results: [], provider: 'none' });
  } catch (error: any) {
    console.error('[Places Route Exception]', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
