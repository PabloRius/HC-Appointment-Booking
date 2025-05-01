import { useProfile } from "@/hooks/useProfile";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const PresentationHeader = () => {
  const { profile, loading } = useProfile();

  return (
    <header className="relative bg-white border-b flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 gap-10 h-16">
      <Link
        href="/"
        className="flex items-center gap-2 hover:scale-110 transition-all"
      >
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
          className="h-6 w-6 text-teal-600"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
        <span className="text-xl font-bold">MediConnect</span>
      </Link>

      {profile && !loading ? (
        <Link href="/dashboard">
          <Button className="transition-all flex flex-row gap-1 hover:gap-2 bg-teal-600 hover:bg-teal-700">
            Your dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : !loading ? (
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Register</Button>
          </Link>
        </div>
      ) : (
        <Button disabled>
          Loading <Loader2 className="animate-spin" />
        </Button>
      )}
    </header>
  );
};
