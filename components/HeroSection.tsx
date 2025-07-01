'use client';

import Image from 'next/image';
import Link from 'next/link';
import 'animate.css';

export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-800 overflow-hidden"
      id="hero"
    >
      {/* Background Image */}
      <Image
        src="/hero.jpg" // 🔁 Replace with your own photo path
        alt="Oreoluwa Venture"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-40"
        priority
      />

      {/* Overlay content */}
      <div className="z-10 text-center px-4 max-w-2xl animate__animated animate__fadeInUp">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Your One-Stop Biscuit Source
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Experience unbeatable variety, quality, and customer care with over a decade of excellence.
        </p>
        <Link
          href="#catalogue"
          className="inline-block bg-[#800020] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-[#5c4033] animate__animated animate__bounce animate__infinite"
        >
          Buy Now
        </Link>
      </div>
    </section>
  );
}
