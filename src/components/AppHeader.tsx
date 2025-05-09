
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ShieldEllipsis } from "lucide-react"; // Using ShieldEllipsis as a logo icon
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <div className="flex items-center">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <ShieldEllipsis className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-foreground">SafeHaven</h1>
        </Link>
      </div>
      {/* Future elements like user profile can be added here */}
      {/* <div className="ml-auto"> User Profile </div> */}
    </header>
  );
}
