'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import 'animate.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md animate__animated animate__fadeInDown">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Oreoluwa Venture
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="#about" className="hover:text-blue-500">About</Link>
          <Link href="#catalogue" className="hover:text-blue-500">Catalogue</Link>
          <Link href="#contact" className="hover:text-blue-500">Contact</Link>
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
          <nav className="flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-200">
            <Link href="/" className="hover:text-blue-500">Home</Link>
            <Link href="#about" className="hover:text-blue-500">About</Link>
            <Link href="#catalogue" className="hover:text-blue-500">Catalogue</Link>
            <Link href="#contact" className="hover:text-blue-500">Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
