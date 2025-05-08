"use client";
import type { SafeLocation, SafeLocationType } from "@/services/safe-location";
import type { Coordinates } from "@/services/geolocation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ListChecks, Accessibility, MapPin, Route, Edit3, Hospital, School2, Home, Landmark, Building, ThumbsUp, ThumbsDown, Loader2, UsersRound, type LucideIcon } from "lucide-react";
import { calculateDistance, cn } from "@/lib/utils";
import { useState, type ElementType } from "react";
import { UpdateResourcesDialog } from "./UpdateResourcesDialog";
import { useToast } from "@/hooks/use-toast";
import { reportLocationStatus } from "@/services/safe-location";


interface SafeLocationCardProps {
  location: SafeLocation;
  currentUserCoordinates: Coordinates | null;
}

const locationTypeIcons: Record<SafeLocationType, LucideIcon | ElementType> = {
  shelter: Home,
  hospital: Hospital,
  school: School2,
  community_center: Users,
  temple: Landmark,
  other_public: Building,
};

export function SafeLocationCard({ location: initialLocation, currentUserCoordinates }: SafeLocationCardProps) {
  const [location, setLocation] = useState<SafeLocation>(initialLocation);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isReportingStatus, setIsReportingStatus] = useState(false);
  const { toast } = useToast();

  let distance: string | null = null;
  if (currentUserCoordinates && location.coordinates) {
    const distKm = calculateDistance(currentUserCoordinates, location.coordinates);
    distance = `${distKm.toFixed(1)} km away`;
  }

  const handleViewRoute = () => {
    if (currentUserCoordinates && location.coordinates) {
      const origin = `${currentUserCoordinates.latitude},${currentUserCoordinates.longitude}`;
      const destination = `${location.coordinates.latitude},${location.coordinates.longitude}`;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
      window.open(googleMapsUrl, '_blank');
    } else {
       toast({
        title: "Route Unavailable",
        description: "Cannot display route. Ensure your location is enabled or you have searched by address.",
        variant: "destructive",
      });
    }
  };

  const handleResourceUpdateSuccess = (locationId: string, updatedResources: string[]) => {
    if (location.id === locationId) {
      setLocation(prevLocation => ({ ...prevLocation, resources: updatedResources }));
    }
  };

  const handleReportLocationStatus = async (isSafeReport: boolean) => {
    setIsReportingStatus(true);
    try {
      const success = await reportLocationStatus(location.id, isSafeReport);
      if (success) {
        toast({
          title: "Status Reported",
          description: `Thank you for your report on ${location.name}.`,
        });
        setLocation(prevLocation => ({
          ...prevLocation,
          safeReports: prevLocation.safeReports + (isSafeReport ? 1 : 0),
          unsafeReports: prevLocation.unsafeReports + (!isSafeReport ? 1 : 0),
        }));
      } else {
        toast({
          title: "Report Failed",
          description: "Could not submit status report. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error reporting status:", error);
      toast({
        title: "Report Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsReportingStatus(false);
    }
  };


  const LocationIcon = locationTypeIcons[location.type] || MapPin;

  let statusDisplayElement = null;
  if (location.unsafeReports > 0) {
    statusDisplayElement = (
      <Badge variant="destructive" className="ml-2 text-xs whitespace-nowrap py-0.5 px-1.5">
        Unsafe ({location.unsafeReports} report{location.unsafeReports !== 1 ? 's' : ''})
      </Badge>
    );
  } else if (location.safeReports > 2) {
    statusDisplayElement = (
      <Badge variant="default" className="ml-2 text-xs whitespace-nowrap py-0.5 px-1.5"> {/* Using primary (blue) for "Safe" */}
        Safe ({location.safeReports} report{location.safeReports !== 1 ? 's' : ''})
      </Badge>
    );
  }

  return (
    <>
      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <LocationIcon className="text-primary h-5 w-5 flex-shrink-0 mr-2" />
            <span className="flex-1 truncate">{location.name}</span>
            {statusDisplayElement}
          </CardTitle>
           <div className="flex items-center gap-2 text-xs mt-1 mb-1">
            <Badge variant={location.safeReports > 0 ? "secondary" : "outline"} className="py-0.5 px-1.5 text-xs">
              Safe Reports: {location.safeReports}
            </Badge>
            <Badge variant={location.unsafeReports > 0 ? "destructive" : "outline"} className="py-0.5 px-1.5 text-xs">
              Unsafe Reports: {location.unsafeReports}
            </Badge>
          </div>
          <CardDescription>
            {distance ? `Approx. ${distance}` : `Lat: ${location.coordinates.latitude.toFixed(4)}, Lon: ${location.coordinates.longitude.toFixed(4)}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 flex-grow">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Capacity: {location.capacity} people</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <UsersRound className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Occupancy: {location.currentOccupancy} / {location.capacity}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Accessibility className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span>Accessibility: {location.accessibility}</span>
          </div>
          {location.resources.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                Available Resources:
              </h4>
              <div className="flex flex-wrap gap-2">
                {location.resources.map((resource) => (
                  <Badge key={resource} variant="secondary" className="text-xs">
                    {resource}
                  </Badge>
                ))}
              </div>
            </div>
          )}
           {location.resources.length === 0 && (
             <div>
              <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                Available Resources:
              </h4>
              <p className="text-xs text-muted-foreground">No resources reported yet or none available.</p>
            </div>
           )}
            <div className="mt-4 pt-4 border-t border-border/50">
              <h4 className="text-sm font-medium mb-2">Report Location Safety:</h4>
              <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleReportLocationStatus(true)} 
                    className="flex-1"
                    disabled={isReportingStatus}
                    title="Report this location as currently safe"
                  >
                      {isReportingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsUp className="mr-2 h-4 w-4" />} Mark Safe
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleReportLocationStatus(false)} 
                    className="flex-1"
                    disabled={isReportingStatus}
                    title="Report this location as currently unsafe"
                  >
                       {isReportingStatus ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ThumbsDown className="mr-2 h-4 w-4" />} Mark Unsafe
                  </Button>
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            variant="outline"
            className="w-full"
            disabled={!currentUserCoordinates || !location.coordinates}
            onClick={handleViewRoute}
            title={!currentUserCoordinates ? "Enable location or search by address to view routes" : "Get directions to this location on Google Maps"}
          >
            <Route className="mr-2 h-4 w-4" />
            Get Directions
          </Button>
          <Button
            variant="secondary"
            className={cn("w-full", "text-xs sm:text-sm")} 
            onClick={() => setIsUpdateDialogOpen(true)}
            title="Report or update available resources at this location"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Report Resources
          </Button>
        </CardFooter>
      </Card>
      
      <UpdateResourcesDialog
        location={location}
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        onUpdateSuccess={handleResourceUpdateSuccess}
      />
    </>
  );
}
