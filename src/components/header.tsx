"use server";

import { auth } from "@/auth";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="relative bg-white border-b flex flex-col sm:flex-row items-center justify-center sm:justify-between p-4 md:px-6 gap-10">
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
      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6">
        <Link href="#features" className="text-sm font-medium hover:underline">
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="text-sm font-medium hover:underline"
        >
          How It Works
        </Link>
        <Link
          href="#testimonials"
          className="text-sm font-medium hover:underline"
        >
          Testimonials
        </Link>
      </nav>
      {session && session?.user ? (
        <Link href="/dashboard">
          <Button className="transition-all flex flex-row gap-1 hover:gap-2 bg-teal-600 hover:bg-teal-700">
            Your dashboard <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </header>
  );
};
