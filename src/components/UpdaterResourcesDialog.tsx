
"use client";

import type { SafeLocation} from "@/services/safe-location";
import { COMMON_RESOURCES, updateSafeLocationResources } from "@/services/safe-location";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, type FormEvent } from "react";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface UpdateResourcesDialogProps {
  location: SafeLocation;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateSuccess: (locationId: string, updatedResources: string[]) => void;
}

export function UpdateResourcesDialog({
  location,
  isOpen,
  onOpenChange,
  onUpdateSuccess,
}: UpdateResourcesDialogProps) {
  const { toast } = useToast();
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location) {
      setSelectedResources([...location.resources]);
    }
  }, [location]);

  const handleCheckboxChange = (resource: string, checked: boolean) => {
    setSelectedResources((prev) =>
      checked ? [...prev, resource] : prev.filter((r) => r !== resource)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await updateSafeLocationResources(location.id, selectedResources);
      if (success) {
        toast({
          title: "Resources Updated",
          description: `Availability for ${location.name} submitted. This will be reviewed.`,
        });
        onUpdateSuccess(location.id, selectedResources);
        onOpenChange(false); // Close dialog on success
      } else {
        toast({
          title: "Update Failed",
          description: "Could not submit resource update. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating resources:", error);
      toast({
        title: "Update Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Report Resource Availability</DialogTitle>
          <DialogDescription>
            Update the available resources for {location.name}. Your report helps keep information accurate.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Community Reporting</AlertTitle>
              <AlertDescription>
                Please only report resources you can confirm are currently available at this location.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <p className="font-medium text-sm">Select available resources:</p>
              {COMMON_RESOURCES.map((resource) => (
                <div key={resource} className="flex items-center space-x-2">
                  <Checkbox
                    id={`resource-${resource}-${location.id}`}
                    checked={selectedResources.includes(resource)}
                    onCheckedChange={(checked) => handleCheckboxChange(resource, !!checked)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={`resource-${resource}-${location.id}`} className="text-sm font-normal">
                    {resource}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
