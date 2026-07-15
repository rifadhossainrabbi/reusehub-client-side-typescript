'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudUpload,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  X,
  Loader2,
  Info,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast'; // Toaster ইম্পোর্ট নিশ্চিত করুন
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

// Form Data Type
interface IProductForm {
  title: string;
  price: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: FileList;
}

const AddProductPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<IProductForm>();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size too large! Max 5MB allowed.');
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setValue('image', null as any); // Form state রিসেট
  };

  const onSubmit = async (data: IProductForm) => {
    if (!previewImage) return toast.error('Please select a product image!');

    setIsUploading(true);
    const loadingToast = toast.loading(
      'Listing your gadget in the sanctuary...',
    );

    try {
      // ১. ImgBB-তে ইমেজ আপলোড
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append('image', imageFile);

      const imgResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const imgData = await imgResponse.json();

      if (!imgData.success) throw new Error('ImgBB upload failed');

      // ২. ব্যাকেন্ডে ডাটা পাঠানো (সঠিক URL ব্যবহার নিশ্চিত করুন)
      const productData = {
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        status: 'pending',
        price: parseFloat(data.price),
        category: data.category,
        imageUrl: imgData.data.url,
        seller: {
          name: session?.user?.name,
          email: session?.user?.email,
          id: session?.user?.id,
        },
      };

      // আপনার .env এ NEXT_PUBLIC_API_URL=http://localhost:5000 হতে হবে
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Server rejected the product');
      }

      toast.success('Product listed successfully!', { id: loadingToast });
      reset();
      setPreviewImage(null);
      router.push('/dashboard/user/my-list');
    } catch (error: any) {
      console.error('Submission Error:', error);
      toast.error(error.message || 'Something went wrong!', {
        id: loadingToast,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* টোস্টার এখানে দিতে হবে যাতে মেসেজ দেখা যায় */}
      <Toaster position="top-right" reverseOrder={false} />

      <header className="flex justify-between items-center px-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          List New Gadget
        </h1>
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-900/30">
          <CheckCircle size={12} /> <span>Deployment Stage 1</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* উন্নত ইমেজ আপলোড সেকশন */}
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">
                Product Visuals
              </label>
              <div
                className={`relative h-64 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center overflow-hidden ${previewImage ? 'border-blue-500 bg-slate-50 dark:bg-slate-950' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
              >
                <AnimatePresence mode="wait">
                  {previewImage ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative w-full h-full group"
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={removeImage}
                          className="bg-red-500 text-white p-3 rounded-full hover:scale-110 transition-transform cursor-pointer"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center p-6 space-y-4"
                    >
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                        <CloudUpload size={32} />
                      </div>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        Click or drag to upload{' '}
                        <span className="text-blue-600">Product Image</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        PNG, JPG or WEBP (Max 5MB)
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!previewImage && (
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    {...register('image', {
                      required: true,
                      onChange: handleImageChange,
                    })}
                  />
                )}
              </div>
            </div>

            <InputField
              label="Gadget Title"
              name="title"
              register={register}
              required
              errors={errors}
              placeholder="e.g. MacBook Pro M3 Max - Space Black"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Offer Price ($)"
                name="price"
                type="number"
                register={register}
                required
                errors={errors}
                placeholder="999"
              />
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer"
                >
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Watch">Watch</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>
            </div>

            <InputField
              label="Short Highlight"
              name="shortDescription"
              register={register}
              required
              errors={errors}
              placeholder="One sentence about the best part of this gear"
            />

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">
                Full Specifications
              </label>
              <textarea
                {...register('fullDescription', { required: true })}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                placeholder="Explain the condition, warranty, and tech specs..."
              />
            </div>

            <button
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? (
                <>
                  {' '}
                  <Loader2 className="animate-spin" size={20} />{' '}
                  <span>Synchronizing...</span>{' '}
                </>
              ) : (
                <>
                  {' '}
                  <span>Publish Gadget</span> <ArrowRight size={18} />{' '}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar টিপস */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 mb-8 border-b dark:border-slate-800 pb-4">
              <Lightbulb size={20} />
              <h4 className="font-black uppercase text-xs tracking-widest">
                Listing Pro Tips
              </h4>
            </div>
            <ul className="space-y-8">
              <TipItem
                title="Daylight Photos"
                desc="Gadgets look more authentic and cleaner in natural lighting."
              />
              <TipItem
                title="Transparent Specs"
                desc="Honest condition reports lead to 2x faster sales."
              />
              <TipItem
                title="Price Wisdom"
                desc="Search similar items to keep your price competitive."
              />
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Info size={24} />
            </div>
            <h4 className="text-xl font-black">Listing Score</h4>
            <p className="text-sm opacity-90 font-medium leading-relaxed">
              Complete all fields to reach a{' '}
              <span className="font-black">100% Visibility Score</span> and get
              featured on the Home Page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// হেল্পার ইনপুট কম্পোনেন্ট
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
    <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      {...register(name, {
        required: required ? `${label} is required` : false,
      })}
      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-400"
      placeholder={placeholder}
    />
    {errors?.[name] && (
      <p className="text-red-600 text-[10px] font-black uppercase mt-1 ml-1 tracking-tighter">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

const TipItem = ({ title, desc }: { title: string; desc: string }) => (
  <li className="flex items-start space-x-4">
    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
    <div className="space-y-1">
      <p className="text-sm font-black text-slate-900 dark:text-white leading-none">
        {title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {desc}
      </p>
    </div>
  </li>
);

export default AddProductPage;
