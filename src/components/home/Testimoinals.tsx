'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Power User',
    text: 'Found a MacBook M2 at 40% less than market price. The verification logs gave me total peace of mind.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Tech Enthusiast',
    text: 'Selling my old iPhone was seamless. The escrow system ensures you get paid fairly and on time.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Marcus Thorne',
    role: 'Merchant',
    text: 'ReuseHub is the only sanctuary for high-end gear. The quality checks are top-notch.',
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 w-full bg-white dark:bg-slate-950 transition-colors duration-500">
      <div className="container mx-auto px-4 md:px-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Seeker <span className="text-blue-700">Testimonials</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Voices from our growing ecosystem of sustainable tech traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative group"
            >
              <Quote
                className="absolute top-6 right-8 text-blue-600/10 group-hover:text-blue-600/20 transition-colors"
                size={60}
              />
              <div className="flex gap-1 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="text-amber-500 fill-amber-500"
                  />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6 italic">
                "{rev.text}"
              </p>
              <div className="border-t dark:border-slate-800 pt-6">
                <p className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tighter">
                  {rev.name}
                </p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {rev.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
