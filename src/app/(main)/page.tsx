"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SafeLocationCard } from "@/components/SafeLocationCard";
import { getCurrentLocation, geocodeAddress, type Address, type Coordinates } from "@/services/geolocation";
import { getSafeLocations, type SafeLocation } from "@/services/safe-location";
import { Loader2, MapPin, Search, AlertTriangle, Map } from "lucide-react"; // Changed Route to Map
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearchingByAddress, setIsSearchingByAddress] = useState(false);
  const [currentUserCoordinates, setCurrentUserCoordinates] = useState<Coordinates | null>(null);

  const fetchLocationsAndUpdateUserCoords = async (latitude?: number, longitude?: number, source: 'current' | 'search' = 'current') => {
    setIsLoading(true);
    setError(null);
    try {
      let coordsToFetch: Coordinates;
      if (latitude !== undefined && longitude !== undefined) {
        coordsToFetch = { latitude, longitude };
      } else {
        // Fallback to default if no coords provided (e.g. initial load failed)
        const currentLocation = await getCurrentLocation(); 
        coordsToFetch = currentLocation;
        setCurrentUserCoordinates(currentLocation); // Update current user coords
      }
      
      if(source === 'search' && latitude !== undefined && longitude !== undefined) {
        setCurrentUserCoordinates({latitude, longitude}); // Update based on search
      } else if (source === 'current' && latitude !== undefined && longitude !== undefined) {
         setCurrentUserCoordinates({latitude, longitude}); // Update based on current location
      }


      const locations = await getSafeLocations(coordsToFetch);
      setSafeLocations(locations);
    } catch (err) {
      console.error("Error fetching safe locations:", err);
      setError("Failed to load safe locations. Please try refreshing or check your connection.");
      setSafeLocations([]); // Clear locations on error
      // setCurrentUserCoordinates(null); // Clear user coords on error potentially
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load based on current location
    getCurrentLocation()
      .then(coords => {
        setCurrentUserCoordinates(coords);
        fetchLocationsAndUpdateUserCoords(coords.latitude, coords.longitude, 'current');
      })
      .catch(err => {
        console.error("Error getting current location:", err);
        setError("Could not retrieve your current location. Displaying default locations. Allow location access or search by address to see distances.");
        // Fetch default locations if current location fails
        fetchLocationsAndUpdateUserCoords(34.0522, -118.2437, 'current'); // Default to LA coordinates
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!searchTerm.trim()) {
      // If search term is empty, fetch based on current location again
      getCurrentLocation()
        .then(coords => {
            setCurrentUserCoordinates(coords);
            fetchLocationsAndUpdateUserCoords(coords.latitude, coords.longitude, 'current');
        })
        .catch(() => {
            // setError("Could not retrieve current location for re-fetch.");
            fetchLocationsAndUpdateUserCoords(34.0522, -118.2437, 'current'); // Default on error
        });
      return;
    }

    setIsSearchingByAddress(true);
    setError(null);
    try {
      // Basic address parsing - for a real app, use a more robust parser or separate fields
      const addressParts = searchTerm.split(",");
      const mockAddress: Address = {
        street: addressParts[0]?.trim() || "123 Main St",
        city: addressParts[1]?.trim() || "Los Angeles",
        state: addressParts[2]?.trim() || "CA",
        zipCode: addressParts[3]?.trim() || "90001",
        country: addressParts[4]?.trim() || "USA",
      };
      const coords = await geocodeAddress(mockAddress);
      setCurrentUserCoordinates(coords); // Set user coords to searched address
      await fetchLocationsAndUpdateUserCoords(coords.latitude, coords.longitude, 'search');
    } catch (err) {
      console.error("Error geocoding address:", err);
      setError("Failed to find locations for the specified address. Please try a different address.");
      setSafeLocations([]);
      // setCurrentUserCoordinates(null);
    } finally {
      setIsSearchingByAddress(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Find a Safe Place
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Search for shelters and secure locations near you or by address.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 flex flex-col sm:flex-row gap-2 items-center max-w-2xl mx-auto">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter address or city (e.g., 123 Main St, Anytown)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
            aria-label="Search for safe locations"
          />
        </div>
        <Button type="submit" disabled={isSearchingByAddress || isLoading} className="w-full sm:w-auto">
          {isSearchingByAddress ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </form>

      {/* Interactive Map Placeholder */}
      <div className="mb-8 bg-muted rounded-lg shadow-md p-4 h-auto md:h-auto flex flex-col items-center justify-center text-center">
        <Map className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-xl font-semibold text-foreground">Overview Map of Safe Locations</h3>
        <p className="text-muted-foreground max-w-2xl">
          This map provides a general overview. Safe locations found are listed below. 
          For directions, click the 'Get Directions' button on any specific location card.
        </p>
        <Image 
            src="https://picsum.photos/800/350" 
            alt="Overview map showing general locations" 
            width={800} 
            height={350} 
            className="mt-4 rounded-md object-cover opacity-60"
            data-ai-hint="map overview locations" 
        />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : safeLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeLocations.map((location) => (
            <SafeLocationCard key={location.id} location={location} currentUserCoordinates={currentUserCoordinates} />
          ))}
        </div>
      ) : (
        !error && ( // Only show "no locations" if there isn't already an error message
          <div className="text-center py-10 bg-card rounded-lg shadow-sm">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-xl font-medium text-foreground">No Safe Locations Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or check back later.
            </p>
          </div>
        )
      )}
    </div>
  );
}
