'use client';
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface ISlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  btnText: string;
  link: string;
}

const sliderData: ISlide[] = [
  {
    id: 1,
    image: '/assets/reusehub1.png', // আপনার প্রথম ইমেজ (All gadgets desk)
    title: 'Your Complete Digital Ecosystem',
    subtitle:
      'From flagships to smart gear, find everything your digital life demands in one place.',
    btnText: 'Browse Collection',
    link: '/explore',
  },
  {
    id: 2,
    image: '/assets/reusehub2.png', // আপনার দ্বিতীয় ইমেজ (Laptops on tiers)
    title: 'Pro-Level Workstations',
    subtitle:
      'High-performance laptops from Apple, Dell, and Razer at unbeatable secondary prices.',
    btnText: 'Browse Collection',
    link: '/explore',
  },
  {
    id: 3,
    image: '/assets/reusehub4.png', // আপনার তৃতীয় ইমেজ (Phones on glass)
    title: 'Verified Flagship Mobility',
    subtitle:
      'Get the latest iPhones and Pixel devices, expert-verified for peak performance.',
    btnText: 'Browse Collection',
    link: '/explore',
  },
  {
    id: 4,
    image: '/assets/reusehub5.png', // আপনার চতুর্থ ইমেজ (Camera gear desk)
    title: 'Tools for Visual Storytellers',
    subtitle:
      'Professional cameras, drones, and accessories to capture your greatest moments.',
    btnText: 'Browse Collection',
    link: '/explore',
  },
  {
    id: 5,
    image: '/assets/reusehub6.png', // আপনার পঞ্চম ইমেজ (Eco-friendly desk)
    title: 'Join the Circular Economy',
    subtitle:
      'Give premium tech a second life and contribute to a more sustainable, greener planet.',
    btnText: 'Browse Collection',
    link: '/explore',
  },
];

const Banner: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[70vh] w-full bg-slate-100 dark:bg-slate-900 animate-pulse" />
    );
  }

  return (
    <section className="h-[70vh] w-full overflow-hidden relative border-b border-slate-200 dark:border-slate-800">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        speed={1200}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        loop={true}
        className="h-full w-full"
      >
        {sliderData.map(slide => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative h-full w-full bg-cover bg-center flex items-center justify-center text-center px-4"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* মডার্ন ডার্ক ওভারলে - ইমেজের ভিজিবিলিটি বাড়াতে */}
              <div className="absolute inset-0 bg-slate-950/50 dark:bg-slate-950/70 z-10" />

              <div className="relative z-20 max-w-4xl space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="bg-blue-600/30 text-white border border-blue-500/40 text-[10px] font-black uppercase tracking-[0.4em] px-6 py-2.5 rounded-full mb-6 inline-flex items-center gap-2 backdrop-blur-sm">
                    <FaShieldAlt className="text-blue-400" /> Premium Archives
                  </span>

                  <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed mt-4 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                </motion.div>

                {/* Fixed Action Buttons (Centered) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4"
                >
                  <Link
                    href={slide.link}
                    className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-600/30 active:scale-95 cursor-pointer"
                  >
                    {slide.btnText} <FaArrowRight />
                  </Link>

                  <Link
                    href="/about"
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
