"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  Bell,
  Loader2Icon,
  Loader,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth.store";

export default function Home() {
  const router = useRouter();
  const [isAuth, setisAuth] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setisAuth(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="from-primary-50 min-h-screen bg-gradient-to-br to-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-primary-600 text-2xl font-bold">Notes App</h1>
          <div className="space-x-4">
            {isAuth ? (
              <span className="inline-flex animate-spin">
                <Loader2 className="text-muted-foreground h-4 w-4" />
              </span>
            ) : isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                {" "}
                <Link href="/login" className="btn-secondary">
                  Login
                  {isAuthenticated}
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-5xl font-bold text-gray-900">
            Organize Your Life with{" "}
            <span className="text-primary-600">Smart Task Management</span>
          </h2>
          <p className="mb-12 text-xl text-gray-600">
            Create tasks, set deadlines, and receive timely reminders. Never
            miss an important deadline again.
          </p>

          <div className="mb-16 grid gap-8 md:grid-cols-3">
            <div className="card text-center">
              <CheckCircle className="text-primary-600 mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-semibold">Easy Task Creation</h3>
              <p className="text-gray-600">
                Create and manage tasks with a simple, intuitive interface
              </p>
            </div>
            <div className="card text-center">
              <Calendar className="text-primary-600 mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-semibold">Deadline Tracking</h3>
              <p className="text-gray-600">
                Set deadlines and keep track of all your important dates
              </p>
            </div>
            <div className="card text-center">
              <Bell className="text-primary-600 mx-auto mb-4 h-12 w-12" />
              <h3 className="mb-2 text-xl font-semibold">Email Reminders</h3>
              <p className="text-gray-600">
                Get email notifications before your tasks are due
              </p>
            </div>
          </div>
          {isAuth ? (
            <span className="inline-flex animate-spin">
              <Loader2 className="text-muted-foreground h-4 w-4" />
            </span>
          ) : isAuthenticated ? (
            <Button asChild>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
