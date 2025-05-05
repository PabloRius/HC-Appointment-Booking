import { Calendar, Home, LogOut, User } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "./ui/button";

export const AppSidebar = () => {
  const { profile, logout } = useProfile();
  const { role } = profile!;
  return (
    <Sidebar collapsible="icon" className="z-0">
      <SidebarHeader className="border-b p-4 h-16 overflow-x-hidden">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="min-h-6 min-w-6 text-teal-600"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span className="text-xl font-bold">MediConnect</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-2 flex flex-col gap-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Dashboard">
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Appointments">
              <Link
                href={
                  role === "patient"
                    ? "/dashboard/appointments"
                    : role === "doctor"
                    ? "/dashboard/availability"
                    : "/dashboard"
                }
              >
                <Calendar className="h-4 w-4" />
                <span>
                  {role === "patient"
                    ? "Appointments"
                    : role === "doctor"
                    ? "Schedule"
                    : null}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <Link href="/dashboard/profile">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Button
                onClick={() => {
                  logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
