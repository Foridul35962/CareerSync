"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { forgetPass } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

const ForgetPassDesign = ({ setEmail }: {setEmail: React.Dispatch<React.SetStateAction<string>>}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string }>();

    const {authLoading} = useSelector((state:RootState)=>state.auth)
    const dispatch = useDispatch<AppDispatch>()

    const handleFormSubmit = async (data: { email: string }) => {
        try {
            await dispatch(forgetPass(data)).unwrap()
            setEmail(data.email)
        } catch (error:any) {
            toast.error(error.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-black bg-white px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8"
            >
                {/* Icon & Title */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
                        <Mail className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Forgot password?</h2>
                    <p className="mt-2 text-gray-500">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                            Email Address
                        </label>
                        <div className="mt-2 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email address" }
                                })}
                                id="email"
                                type="email"
                                className={`block w-full pl-11 pr-4 py-4 border ${
                                    errors.email ? 'border-red-500' : 'border-gray-200'
                                } rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all`}
                                placeholder="Enter your email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-2 text-xs text-red-500 font-medium">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={authLoading}
                            type="submit"
                            className="w-full py-4 bg-blue-500 cursor-pointer disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {authLoading ? (
                                <Loader2 className="animate-spin h-6 w-6" />
                            ) : (
                                <>
                                    Reset Password <ChevronRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </motion.button>

                        <Link 
                            href="/login"
                            className="flex items-center justify-center w-full py-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to log in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ForgetPassDesign;