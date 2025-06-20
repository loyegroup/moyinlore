'use client';

import 'animate.css';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-16 px-4 bg-white dark:bg-gray-900 animate__animated animate__fadeIn"
    >
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About Us
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
          Oreoluwa Venture is a trusted name in biscuit distribution and retail, proudly serving customers for over a decade. 
          With a reputation built on consistency, quality, and excellent customer service, we’ve become a household choice 
          for individuals, retailers, and event planners across Nigeria. Whether you're buying in bulk or for personal use, 
          we’re here to deliver satisfaction—one biscuit at a time.
        </p>
      </div>
    </section>
  );
}
