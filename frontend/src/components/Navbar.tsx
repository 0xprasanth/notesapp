"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { user, clearAuth, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    clearAuth();
    await signOut({ redirect: false });
    toast.success("Signed out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            NotesApp
          </Link>
          <div className="hidden space-x-4 md:flex">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              href="/tasks/new"
              className="text-sm font-medium text-gray-700 hover:text-primary"
            >
              New Task
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <span className="text-sm text-gray-700">
              {user.name}
            </span>
          )}
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}


