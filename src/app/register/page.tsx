'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch('password', '');

  const checks = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const onSubmit = async (data: any) => {
    if (!Object.values(checks).every(Boolean)) {
      toast.error('Please meet all password requirements!');
      return;
    }
    setIsLoading(true);
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
      toast.success('Account created successfully!');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] py-16 px-4 flex justify-center items-center font-sans transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-[1.5px] rounded-[3rem] overflow-hidden group 
                   dark:bg-gradient-to-br dark:from-blue-600 dark:via-purple-600 dark:to-indigo-600 
                   dark:shadow-[0_0_40px_-15px_rgba(59,130,246,0.5)] transition-all duration-500"
      >
        <div className="w-full max-w-xl bg-white dark:bg-slate-950 rounded-[2.9rem] p-8 md:p-12 border border-slate-200 dark:border-none relative z-10">
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
            {/* Light Mode Contrast Improved */}
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
              {/* Label Contrast Improved */}
              <label className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-10 text-slate-500 hover:text-blue-600"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              {/* Text Contrast Improved */}
              <p className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-500 tracking-widest mb-4">
                Security Protocol
              </p>
              <div className="grid grid-cols-2 gap-y-3">
                <Requirement met={checks.length} label="6+ Characters" />
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
              {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 space-y-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="mx-4 text-[10px] font-black uppercase text-slate-500 dark:text-slate-500 tracking-widest">
                Or social entry
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            {/* Google Button - High Quality Hover Effect */}
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                authClient.signIn.social({
                  provider: 'google',
                  callbackURL: '/',
                })
              }
              className="w-full flex items-center justify-center space-x-3 bg-white dark:bg-slate-900 
                         border-2 border-slate-100 dark:border-slate-800 py-4 rounded-xl 
                         hover:bg-purple-500 hover:text-white dark:hover:border-blue-500 
                         hover:shadow-lg hover:shadow-blue-500/10 transition-all 
                         font-bold text-sm text-slate-800 dark:text-slate-200 cursor-pointer"
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
    {/* Label Contrast Fixed for Light Theme */}
    <label className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      {...register(name, {
        required: required ? `${label} is required` : false,
      })}
      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
                 text-slate-900 dark:text-white rounded-xl p-4 text-sm font-bold 
                 focus:ring-2 focus:ring-blue-600 dark:focus:ring-purple-600 outline-none transition-all 
                 placeholder:text-slate-400"
      placeholder={placeholder}
    />
    {errors?.[name] && (
      <p className="text-red-600 text-[10px] uppercase font-bold mt-1 ml-1">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

const Requirement = ({ met, label }: { met: boolean; label: string }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <FaCheck className="text-emerald-600" size={10} />
    ) : (
      <FaTimes className="text-rose-400/40" size={10} />
    )}
    <span
      className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${met ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-600'}`}
    >
      {label}
    </span>
  </div>
);

export default RegisterPage;
