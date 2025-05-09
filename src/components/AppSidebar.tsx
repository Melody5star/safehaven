"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ShieldEllipsis, Home, MessageSquare, AlertTriangle, UserCheck, Settings } from "lucide-react";
import { Separator } from "./ui/separator";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Secure Chat", icon: MessageSquare },
  { href: "/alerts", label: "Emergency Alerts", icon: AlertTriangle },
  { href: "/verify", label: "Citizen Verification", icon: UserCheck },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 hidden md:flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <ShieldEllipsis className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">SafeHaven</span>
        </Link>
      </SidebarHeader>
      <Separator className="hidden md:block" />
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: "right", align: "center" }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="hidden md:block" />
      <SidebarFooter className="p-2 hidden md:block">
         {/* Example: Settings or Logout button */}
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: "Settings", side: "right", align: "center" }}>
                    <Settings/>
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
