


/**
 * Represents the type of a safe location.
 */
export type SafeLocationType = 'shelter' | 'hospital' | 'school' | 'community_center' | 'temple' | 'other_public';

/**
 * Represents a safe location with details such as capacity and resources.
 */
export interface SafeLocation {
  id: string;
  /**
   * The name of the safe location.
   */
  name: string;
  /**
   * The type of the safe location.
   */
  type: SafeLocationType;
  /**
   * The geographical coordinates of the safe location.
   */
  coordinates: { latitude: number; longitude: number };
  /**
   * The maximum capacity of the safe location.
   */
  capacity: number;
  /**
   * The current number of people at the location.
   */
  currentOccupancy: number;
  /**
   * A list of available resources at the safe location (e.g., food, water, medical supplies).
   */
  resources: string[];
  /**
   * Accessibility information for the safe location.
   */
  accessibility: string;
  /**
   * Number of users who reported this location as safe.
   */
  safeReports: number;
  /**
   * Number of users who reported this location as unsafe.
   */
  unsafeReports: number;
}

export const COMMON_RESOURCES = ["Food", "Water", "Medical Supplies", "Shelter", "Blankets", "First Aid"];

/**
 * Asynchronously retrieves a list of safe locations based on the user's current location.
 * These locations are generally public facilities considered safe by default.
 *
 * @param coordinates The user's current geographical coordinates.
 * @returns A promise that resolves to an array of SafeLocation objects.
 */
export async function getSafeLocations(coordinates: { latitude: number; longitude: number }): Promise<SafeLocation[]> {
  // TODO: Implement this by calling an API.
  // Mock data now reflects various types of public safe locations.
  // Houses are considered safe by default but not listed here as discoverable public shelters.
  // Open areas/markets are considered unsafe by default and are not listed.

  const mockLocations: SafeLocation[] = [
    {
      id: '1',
      name: 'Community Relief Shelter',
      type: 'shelter',
      coordinates: { latitude: 34.0522, longitude: -118.2437 }, // Example coordinates
      capacity: 200,
      currentOccupancy: 120,
      resources: ['Food', 'Water', 'Medical Supplies', 'Shelter'],
      accessibility: 'Wheelchair accessible',
      safeReports: 15,
      unsafeReports: 1,
    },
    {
      id: '2',
      name: 'City General Hospital',
      type: 'hospital',
      coordinates: { latitude: 34.0580, longitude: -118.2490 }, // Example coordinates
      capacity: 150, // Patient capacity, not shelter capacity unless specified
      currentOccupancy: 90,
      resources: ['Medical Supplies', 'First Aid', 'Water'],
      accessibility: 'Fully accessible, emergency services',
      safeReports: 25,
      unsafeReports: 0,
    },
    {
      id: '3',
      name: 'National Public School (Emergency Shelter)',
      type: 'school',
      coordinates: { latitude: 34.0622, longitude: -118.2537 }, // Example coordinates
      capacity: 300,
      currentOccupancy: 250,
      resources: ['Food', 'Water', 'Blankets', 'Shelter'],
      accessibility: 'Limited accessibility, ground floor access',
      safeReports: 8,
      unsafeReports: 2,
    },
    {
      id: '4',
      name: 'District Community Hall',
      type: 'community_center',
      coordinates: { latitude: 34.0450, longitude: -118.2380 }, // Example coordinates
      capacity: 100,
      currentOccupancy: 45,
      resources: ['Water', 'Shelter'],
      accessibility: 'Ramp available',
      safeReports: 5,
      unsafeReports: 0,
    },
    {
      id: '5',
      name: 'Shanti Temple Complex (Safe Zone)',
      type: 'temple',
      coordinates: { latitude: 34.0500, longitude: -118.2600 }, // Example coordinates
      capacity: 250,
      currentOccupancy: 180,
      resources: ['Water', 'Shelter', 'Community Kitchen (limited)'],
      accessibility: 'Generally accessible, some areas may have stairs',
      safeReports: 12,
      unsafeReports: 0,
    },
     {
      id: '6',
      name: 'Govt. Boys Higher Secondary School',
      type: 'school',
      coordinates: { latitude: 34.0720, longitude: -118.2590 }, // Example coordinates
      capacity: 400,
      currentOccupancy: 75,
      resources: ['Shelter', 'Water'],
      accessibility: 'Basic accessibility',
      safeReports: 0,
      unsafeReports: 0,
    },
  ];
  
  // Simulate filtering or dynamic fetching based on coordinates if this were a real API
  // For now, just return the mock list.
  return mockLocations;
}

/**
 * Asynchronously updates the reported available resources for a safe location.
 * In a real application, this would call an API to submit this information,
 * potentially for review and then update a central database.
 *
 * @param locationId The ID of the safe location to update.
 * @param updatedResources A list of strings representing the newly reported available resources.
 * @returns A promise that resolves to true if the submission was (mock) successful, false otherwise.
 */
export async function updateSafeLocationResources(locationId: string, updatedResources: string[]): Promise<boolean> {
  // TODO: Implement this by calling a real API.
  console.log(`Mock Update: Attempting to update resources for location ID ${locationId}`);
  console.log("Reported resources:", updatedResources);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // For now, assume the update is always successful for the mock.
  // In a real scenario, the API would handle validation and persistence.
  console.log(`Mock Update: Resources for location ID ${locationId} (mock) submitted successfully.`);
  return true;
}

/**
 * Mock function to report a location's safety status.
 * In a real app, this would trigger a backend process for verification and update.
 * @param locationId The ID of the location.
 * @param isSafeReport Whether the location is being reported as safe (true) or unsafe (false).
 * @returns Promise<boolean> True if the report was successfully submitted (mocked).
 */
export async function reportLocationStatus(locationId: string, isSafeReport: boolean): Promise<boolean> {
    console.log(`Mock Report: Location ${locationId} reported as ${isSafeReport ? 'SAFE' : 'UNSAFE'}.`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would interact with a backend to potentially update the location's status
    // after verification. For this mock, we just log it.
    return true; // Mock success
}

