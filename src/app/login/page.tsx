'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash, FaCheck, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

 const handleDemoAdminLogin = async () => {
   const { error } = await authClient.signIn.email({
     email: 'evan@downey.com',
     password: 'robertDowney1!',
     callbackURL: '/',
   });

   if (error) {
     toast.error(error.message || 'Demo login failed');
   } else {
     toast.success('Logged in as Demo Admin');
   }
 };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: '/', 
    });

    if (error) {
      toast.error(error.message || 'Login failed! Please check credentials.');
      setIsLoading(false);
    } else {
      toast.success('Welcome back to ReuseHub!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-16 px-4 flex justify-center items-center font-sans transition-colors duration-500">
      {/* গ্লোয়িং গ্রাডিয়েন্ট বর্ডার র‍্যাপার (ডার্ক মোডে একটিভ) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-[1.5px] rounded-[3rem] overflow-hidden group 
                   dark:bg-gradient-to-br dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 
                   dark:shadow-[0_0_40px_-15px_rgba(59,130,246,0.5)] transition-all duration-500 w-full max-w-xl"
      >
        {/* মেইন কার্ড কন্টেন্ট */}
        <div className="w-full bg-white dark:bg-slate-950 rounded-[2.9rem] p-8 md:p-12 border border-slate-200 dark:border-none relative z-10">
          <div className="text-center space-y-3 mb-10">
            <div className="flex justify-center items-center space-x-2 text-blue-700 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FaLock size={18} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-blue-700">
                ReuseHub
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">
              Securely access your trading sanctuary.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* ১. ইমেইল ফিল্ড */}
            <InputField
              label="Email Address"
              name="email"
              type="email"
              register={register}
              required
              errors={errors}
              placeholder="Enter your email"
            />

            {/* ২. পাসওয়ার্ড ফিল্ড */}
            <div className="space-y-2 relative">
              <label className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 cursor-pointer"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-[10px] font-black uppercase mt-1 ml-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 hover:opacity-95 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="w-full mt-3 rounded-xl bg-blue-600 py-3 hover:cursor-pointer font-bold text-white hover:bg-blue-700"
            >
              👑 Demo Login
            </button>
          </form>

          {/* ৩. গুগল লগইন (Slide-up effect সহ) */}
          <div className="mt-8 space-y-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="mx-4 text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-widest">
                Secure Entry
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                authClient.signIn.social({
                  provider: 'google',
                  callbackURL: '/',
                })
              }
              className="relative w-full flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 
                         border-2 border-slate-100 dark:border-slate-800 py-4 rounded-xl 
                         overflow-hidden transition-all duration-300
                         font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer group"
            >
              {/* ব্যাকগ্রাউন্ড স্লাইড লেয়ার */}
              <motion.div
                variants={{ hover: { top: 0, opacity: 1 } }}
                initial={{ top: '100%', opacity: 0 }}
                transition={{ duration: 0.3, ease: 'circOut' }}
                className="absolute inset-0 bg-blue-50 dark:bg-blue-600/10 z-0"
              />

              <div className="relative z-10 flex items-center space-x-3">
                <FaGoogle className="text-red-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="transition-colors duration-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                  Continue with Google
                </span>
              </div>
            </motion.button>
          </div>

          <p className="mt-10 text-center text-sm font-bold text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="text-blue-700 dark:text-blue-500 hover:underline ml-1"
            >
              Create One
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// হেল্পার কম্পোনেন্ট (InputField)
const InputField = ({
  label,
  name,
  type = 'text',
  register,
  required,
  errors,
  placeholder,
}: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      {...register(name, {
        required: required ? `${label} is required` : false,
      })}
      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all placeholder:text-slate-400"
      placeholder={placeholder}
    />
    {errors?.[name] && (
      <p className="text-red-600 text-[10px] font-black uppercase mt-1 ml-1">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

export default LoginPage;
