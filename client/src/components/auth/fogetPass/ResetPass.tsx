"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Lock, Loader2, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { emailType } from '@/types/authTypes';
import { resetPass } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ResetPass = ({ email }: emailType) => {
    const { authLoading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch("password");
    const router = useRouter()

    const onSubmit = async (data: any) => {
        try {
            await dispatch(resetPass({ email, password: data.password })).unwrap()
            toast.success('Password Reset Successfully')
            router.push('/login')
        } catch (error: any) {
            toast.error(error.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-black bg-white px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Header section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 mb-6">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Set New Password</h2>
                    <p className="mt-2 text-gray-500">
                        Must be at least 8 characters with letters and numbers.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* New Password Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Minimum 8 characters" },
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                                        message: "Must contain at least one letter and one number"
                                    }
                                })}
                                type={showPass ? "text" : "password"}
                                className={`block w-full pl-11 pr-12 py-4 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500"
                            >
                                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 font-medium ml-1">{errors.password.message as string}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <input
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (val: string) => {
                                        if (watch('password') !== val) {
                                            return "Passwords do not match";
                                        }
                                    },
                                })}
                                type={showConfirmPass ? "text" : "password"}
                                className={`block w-full pl-11 pr-12 py-4 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'} rounded-2xl bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500"
                            >
                                {showConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500 font-medium ml-1">{errors.confirmPassword.message as string}</p>}
                    </div>

                    {/* Reset Button */}
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        disabled={authLoading}
                        type="submit"
                        className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        {authLoading ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            "Reset Password"
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPass;