'use client';

import 'animate.css';

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-16 px-4 bg-white dark:bg-gray-900 animate__animated animate__fadeInUp"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h2>

        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Call any of the numbers below to place an order or make an inquiry.
        </p>

        <div className="space-y-3 text-gray-800 dark:text-gray-200 text-lg">
          <p>
            📞 <a href="tel:+2347086361111" className="text-blue-600 dark:text-blue-400 hover:underline">
              +2347086361111
            </a>
          </p>
          <p>
            📞 <a href="tel:+2348055211465" className="text-blue-600 dark:text-blue-400 hover:underline">
              +2348055211465
            </a>
          </p>
          <p>
            📍 29, Tikulosoro, Agbede, Ikorodu, Lagos, Nigeria
          </p>
        </div>
      </div>
    </section>
  );
}
