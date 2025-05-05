import { useProfile } from "@/hooks/useProfile";
import { User } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export const Header = () => {
  const { profile } = useProfile();
  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-4">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="sm" asChild disabled>
          <Link href="/dashboard/profile">
            <User className="mr-2 h-4 w-4" />
            {profile?.name}
          </Link>
        </Button>
      </div>
    </header>
  );
};
