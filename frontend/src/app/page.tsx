'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Bell, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Task Manager</h1>
          <div className="space-x-4">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Organize Your Life with <span className="text-primary-600">Smart Task Management</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Create tasks, set deadlines, and receive timely reminders. Never miss an important deadline again.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <CheckCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Task Creation</h3>
              <p className="text-gray-600">
                Create and manage tasks with a simple, intuitive interface
              </p>
            </div>
            <div className="card text-center">
              <Calendar className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Deadline Tracking</h3>
              <p className="text-gray-600">
                Set deadlines and keep track of all your important dates
              </p>
            </div>
            <div className="card text-center">
              <Bell className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Reminders</h3>
              <p className="text-gray-600">
                Get email notifications before your tasks are due
              </p>
            </div>
          </div>
          <Button onClick={handleClick}>
            {
              status === 'loading' ? <span className="animate-spin">
                <Loader2Icon className="w-4 h-4" />
              </span> : (status === 'authenticated' ? 'Go to Dashboard' : 'Get Started')
            }
          </Button>
        </div>
      </main>
    </div>
  );
}