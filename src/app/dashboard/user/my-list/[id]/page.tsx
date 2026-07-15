'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  CloudUpload,
  CheckCircle,
  Loader2,
  ArrowLeft,
  X,
  Lightbulb,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

interface IProductForm {
  title: string;
  price: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  image: FileList;
}

const EditProductPage = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IProductForm>({
    defaultValues: {
      title: '',
      price: '',
      category: 'Smartphone',
      shortDescription: '',
      fullDescription: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();

        if (res.ok) {
          reset({
            title: data.title || '',
            price: data.price?.toString() || '',
            category: data.category || 'Smartphone',
            shortDescription: data.shortDescription || '',
            fullDescription: data.fullDescription || '',
          });
          setExistingImageUrl(data.imageUrl);
          setPreviewImage(data.imageUrl);
        } else {
          toast.error('Failed to fetch product');
        }
      } catch (err) {
        toast.error('Protocol error: Artifact logs unreachable');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, reset, API_URL]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (formData: IProductForm) => {
    console.log('✅ Form Data:', formData);
    console.log('✅ Price from form:', formData.price);
    console.log('✅ Price type:', typeof formData.price);

    setIsUpdating(true);
    const loadingToast = toast.loading('Synchronizing updates to sanctuary...');

    try {
      let finalImageUrl = existingImageUrl;

      // ১. নতুন ইমেজ আপলোড
      if (formData.image && formData.image.length > 0) {
        const uploadData = new FormData();
        uploadData.append('image', formData.image[0]);

        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          {
            method: 'POST',
            body: uploadData,
          },
        );
        const imgData = await imgRes.json();
        if (imgData.success) {
          finalImageUrl = imgData.data.url;
        }
      }

      // ২. ডাটা প্রস্তুত করা
      const { image, ...rest } = formData;

      // ✅ সমাধান: সরাসরি number এ কনভার্ট করুন, কোনো রাউন্ডিং বা ফ্লোটিং ইস্যু নেই
      const priceNumber = Number(formData.price);

      // চেক করুন NaN কিনা
      if (isNaN(priceNumber)) {
        throw new Error('Invalid price format');
      }

      console.log('✅ Converted Price:', priceNumber);
      console.log('✅ Price type after conversion:', typeof priceNumber);

      const updatedPayload = {
        ...rest,
        price: priceNumber, // number এ পাঠান
        imageUrl: finalImageUrl,
      };

      console.log('📤 Sending to backend:', updatedPayload);

      // ৩. ব্যাকেন্ডে প্যাচ রিকোয়েস্ট
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPayload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success('Artifact successfully updated!', { id: loadingToast });
        setTimeout(() => router.push('/dashboard/user/my-list'), 1500);
      } else {
        throw new Error(result.message || 'Update protocol failed');
      }
    } catch (error: any) {
      console.error('Update Error:', error);
      toast.error(error.message || 'Update failed', { id: loadingToast });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="font-black uppercase tracking-widest text-slate-400">
          Loading Artifact Data...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 px-2">
      <Toaster position="top-right" />
      <header className="flex justify-between items-center">
        <div className="space-y-2">
          <Link
            href="/dashboard/user/my-list"
            className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Listings
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Modify Artifact
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">
                Update Visual Artifact
              </label>
              <div
                className={`relative h-64 border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center overflow-hidden ${
                  previewImage
                    ? 'border-blue-500 bg-slate-50 dark:bg-slate-950'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {previewImage ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white text-xs font-bold bg-blue-600 px-4 py-2 rounded-full cursor-pointer">
                        Select New Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-4">
                    <CloudUpload size={32} className="text-blue-600 mx-auto" />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      New Image Required
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  {...register('image')}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <InputField
              label="Gadget Identity"
              name="title"
              register={register}
              required
              errors={errors}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ✅ Price ফিল্ড - type="text" ব্যবহার করুন */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
                  Adjusted Price ($)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter price"
                  {...register('price', {
                    required: 'Price is required',
                    validate: value => {
                      const num = Number(value);
                      if (isNaN(num)) return 'Please enter a valid number';
                      if (num <= 0) return 'Price must be greater than 0';
                      return true;
                    },
                  })}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                />
                {errors.price && (
                  <p className="text-red-600 text-[10px] font-black uppercase mt-1 ml-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
                  Archive Category
                </label>
                <select
                  {...register('category')}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer"
                >
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Watch">Watch</option>
                  <option value="Audio">Audio</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-400 tracking-widest ml-1">
                Short Highlight
              </label>
              <input
                {...register('shortDescription', { required: true })}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">
                Full Sanctuary Log
              </label>
              <textarea
                {...register('fullDescription', { required: true })}
                rows={4}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <CheckCircle size={20} />
              )}
              <span>{isUpdating ? 'Processing...' : 'Commit Update'}</span>
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-black uppercase text-xs tracking-widest text-blue-600 mb-6 flex items-center gap-2">
              <Lightbulb size={18} /> Protocol Update
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "Regularly updating your artifacts ensures higher visibility in
              the sanctuary network."
            </p>
          </div>
        </div>
      </div>
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
      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all"
    />
    {errors?.[name] && (
      <p className="text-red-600 text-[10px] font-black uppercase mt-1 ml-1">
        {errors[name]?.message as string}
      </p>
    )}
  </div>
);

export default EditProductPage;
