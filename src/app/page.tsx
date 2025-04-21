"use server";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex-1 flex flex-col gap-24 px-6 py-12 md:px-10 md:py-24 lg:py-32">
      <section>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Seamless Healthcare Appointments
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Connect with healthcare professionals and manage your
                appointments with ease. Our platform streamlines the booking
                process for both patients and doctors.
              </p>
            </div>
            {session && session?.user ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 flex flex-row gap-0 hover:gap-2"
                >
                  Your dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Log in
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            <Image
              alt="Healthcare professionals"
              className="rounded-lg object-cover"
              src="https://ie-explorer.s3.eu-west-1.amazonaws.com/icons/ProfilePlaceholder.svg"
              width="550"
              height="550"
            />
          </div>
        </div>
      </section>
      <section id="features">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm text-teal-700">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Everything You Need in One Place
          </h2>
          <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform offers a comprehensive suite of tools to manage your
            healthcare appointments efficiently.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-teal-100 p-3">
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
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Easy Scheduling</h3>
            <p className="text-center text-gray-500">
              Book appointments with just a few clicks and manage your schedule
              effortlessly.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-teal-100 p-3">
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Doctor Selection</h3>
            <p className="text-center text-gray-500">
              Choose from a wide range of qualified healthcare professionals
              based on your needs.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="rounded-full bg-teal-100 p-3">
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Secure & Private</h3>
            <p className="text-center text-gray-500">
              Your health information is protected with state-of-the-art
              security measures.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
