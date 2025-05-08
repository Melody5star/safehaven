import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/toaster";

export default function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}> {/* Default to collapsed on desktop */}
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <SidebarInset className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-secondary/30">
          {children}
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
