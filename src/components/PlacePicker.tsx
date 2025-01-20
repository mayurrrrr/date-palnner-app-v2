import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface PlacePickerProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
}

interface RecentPlace {
  name: string;
  placeId: string;
}

export function PlacePicker({ onPlaceSelect }: PlacePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [recentPlaces, setRecentPlaces] = useState<RecentPlace[]>([]);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();

        if (!mapRef.current || !inputRef.current) return;

        // Initialize map
        const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City
        const newMap = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(newMap);

        // Initialize SearchBox
        const newSearchBox = new google.maps.places.SearchBox(inputRef.current);
        setSearchBox(newSearchBox);

        // Bias SearchBox results towards current map's viewport
        newMap.addListener('bounds_changed', () => {
          newSearchBox.setBounds(newMap.getBounds() as google.maps.LatLngBounds);
        });

        // Listen for place selection
        newSearchBox.addListener('places_changed', () => {
          const places = newSearchBox.getPlaces();
          if (!places || places.length === 0) return;

          const place = places[0];
          if (!place.geometry || !place.geometry.location) return;

          // Add to recent places
          if (place.name && place.place_id) {
            setRecentPlaces(prev => {
              const newPlace = { name: place.name!, placeId: place.place_id! };
              // Remove duplicate if exists
              const filtered = prev.filter(p => p.placeId !== newPlace.placeId);
              // Add new place to beginning and limit to 5 items
              return [newPlace, ...filtered].slice(0, 5);
            });
          }

          // Update map view
          if (place.geometry.viewport) {
            newMap.fitBounds(place.geometry.viewport);
          } else {
            newMap.setCenter(place.geometry.location);
            newMap.setZoom(17);
          }

          // Remove existing marker if any
          if (marker) {
            marker.setMap(null);
          }

          // Create new marker
          const newMarker = new google.maps.Marker({
            map: newMap,
            position: place.geometry.location,
            title: place.name,
            animation: google.maps.Animation.DROP
          });

          setMarker(newMarker);
          onPlaceSelect(place);
        });

      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (marker) {
        marker.setMap(null);
      }
      if (searchBox) {
        google.maps.event.clearInstanceListeners(searchBox);
      }
      if (map) {
        google.maps.event.clearInstanceListeners(map);
      }
    };
  }, []); // Empty dependency array since we only want to initialize once

  const handleRecentPlaceClick = async (placeId: string) => {
    try {
      const placesService = new google.maps.places.PlacesService(map!);
      
      placesService.getDetails(
        {
          placeId: placeId,
          fields: ['name', 'geometry', 'formatted_address', 'place_id']
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            // Clear and update input
            if (inputRef.current) {
              inputRef.current.value = place.name || '';
            }

            // Update map and marker
            if (place.geometry?.location) {
              map?.setCenter(place.geometry.location);
              map?.setZoom(17);

              // Update marker
              if (marker) marker.setMap(null);
              const newMarker = new google.maps.Marker({
                map: map!,
                position: place.geometry.location,
                title: place.name,
                animation: google.maps.Animation.DROP
              });
              setMarker(newMarker);
            }

            onPlaceSelect(place);
          }
        }
      );
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a place..."
          className="w-full p-3 pr-10 rounded-lg border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 shadow-sm"
        />
        {inputRef.current?.value && (
          <button
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.value = '';
                inputRef.current.focus();
              }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      {recentPlaces.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Recent searches:</h3>
          <div className="space-y-2">
            {recentPlaces.map((place) => (
              <button
                key={place.placeId}
                onClick={() => handleRecentPlaceClick(place.placeId)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded-md text-sm text-gray-700"
              >
                {place.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-64 rounded-lg shadow-md overflow-hidden border border-gray-200"
      />
    </div>
  );
}