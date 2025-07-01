'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-sm">
          &copy; {year} moyinlore. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Created by{' '}
          <a
            href="www.loye-group.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Loye Group
          </a>
        </p>
      </div>
    </footer>
  );
}
// This Footer component is a simple, responsive footer for a Next.js application.