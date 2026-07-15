'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const RegisterPage = () => {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // মাউন্ট চেক (Hydration Mismatch সমাধানের জন্য)
  useEffect(() => {
    setMounted(true);
  }, []);

  const password = watch('password', '');

  // Better-Auth ডিফল্টভাবে ৮ ক্যারেক্টার চায়, তাই এখানে ৮ করা হলো
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const onSubmit = async (data: any) => {
    if (!Object.values(checks).every(Boolean)) {
      toast.error(
        'Please meet all security protocols (8+ chars, Uppercase, Symbol, etc.)',
      );
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        image: data.image || '',
      });

      if (error) {
        toast.error(error.message || 'Registration failed!');
        setIsLoading(false);
      } else {
        toast.success('Citizen identity created! Welcome Seeker.');
        router.push('/login');
      }
    } catch (err) {
      toast.error('System sync failure. Try again.');
      setIsLoading(false);
    }
  };

  // সার্ভার সাইডে থাকাকালীন কিছু রেন্ডার করবে না (এরর এড়াতে)
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-16 px-4 flex justify-center items-center font-sans transition-colors duration-500">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-[1.5px] rounded-[3rem] overflow-hidden group dark:bg-gradient-to-br dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 dark:shadow-[0_0_40px_-15px_rgba(59,130,246,0.5)] transition-all duration-500 w-full max-w-xl"
      >
        <div className="w-full bg-white dark:bg-slate-950 rounded-[2.9rem] p-8 md:p-12 border border-slate-200 dark:border-none relative z-10">
          <div className="text-center space-y-3 mb-10">
            <div className="flex justify-center items-center space-x-2 text-blue-700 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <FaCheck size={20} />
              </div>
              <span className="text-3xl font-black tracking-tighter text-blue-700">
                ReuseHub
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">
              Join the ecosystem of sustainable tech.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="name"
                register={register}
                required
                errors={errors}
                placeholder="John Doe"
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                register={register}
                required
                errors={errors}
                placeholder="john@example.com"
              />
            </div>

            <InputField
              label="Profile Photo URL"
              name="image"
              register={register}
              errors={errors}
              placeholder="https://example.com/photo.jpg"
            />

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
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-500 tracking-widest mb-4">
                Security Protocol
              </p>
              <div className="grid grid-cols-2 gap-y-3">
                <Requirement met={checks.length} label="8+ Characters" />
                <Requirement met={checks.upper} label="Uppercase" />
                <Requirement met={checks.lower} label="Lowercase" />
                <Requirement met={checks.number} label="Number" />
                <Requirement met={checks.special} label="Symbol" />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-blue-600 dark:bg-gradient-to-r dark:from-blue-600 dark:to-purple-600 hover:opacity-95 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Creating Identity...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 space-y-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="mx-4 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Or social entry
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                authClient.signIn.social({
                  provider: 'google',
                  callbackURL: '/',
                })
              }
              className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 py-4 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </motion.button>
          </div>

          <p className="mt-10 text-center text-sm font-bold text-slate-600 dark:text-slate-400">
            Already a member?{' '}
            <Link
              href="/login"
              className="text-blue-700 dark:text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// হেল্পার ইনপুট
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
      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
      placeholder={placeholder}
    />
    {errors?.[name] && (
      <p className="text-red-600 text-[10px] uppercase font-bold mt-1 ml-1">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

// সিকিউরিটি চেকলিস্ট আইটেম
const Requirement = ({ met, label }: { met: boolean; label: string }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <FaCheck className="text-emerald-600" size={10} />
    ) : (
      <FaTimes className="text-rose-400/40" size={10} />
    )}
    <span
      className={`text-[10px] font-bold uppercase tracking-tight ${met ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-600'}`}
    >
      {label}
    </span>
  </div>
);

export default RegisterPage;
