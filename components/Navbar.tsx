'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import 'animate.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md animate__animated animate__fadeInDown">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-14"
          />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex text-sm font-medium text-gray-700 dark:text-gray-200 border-l border-gray-300 dark:border-gray-700">
          {['Home', 'About', 'Catalogue', 'Contact'].map((text, i) => (
            <Link
              key={text}
              href={text === 'Home' ? '/' : `#${text.toLowerCase()}`}
              className={`px-4 py-2 hover:text-blue-500 transition-transform transform hover:scale-110 border-r border-gray-300 dark:border-gray-700`}
            >
              {text}
            </Link>
          ))}
        </nav>

        {/* Hamburger for mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
            <span className="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
            <span className="block w-6 h-0.5 bg-gray-600 dark:bg-gray-300"></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 animate__animated animate__fadeInDown">
          <nav className="flex flex-col text-sm text-gray-700 dark:text-gray-200 border-t border-gray-300 dark:border-gray-700">
            {['Home', 'About', 'Catalogue', 'Contact'].map((text, i) => (
              <Link
                key={text}
                href={text === 'Home' ? '/' : `#${text.toLowerCase()}`}
                className="py-3 px-2 border-b border-gray-300 dark:border-gray-700 hover:text-blue-500 transition-transform transform hover:scale-105"
              >
                {text}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
