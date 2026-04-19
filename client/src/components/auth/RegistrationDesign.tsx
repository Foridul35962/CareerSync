"use client";

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
    User, Mail, Lock, Phone, Briefcase, UserCheck,
    Loader2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { registration } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

const RegisterPageDesign = ({ setVerified, setEmail }: {
    setVerified: React.Dispatch<React.SetStateAction<boolean>>,
    setEmail: React.Dispatch<React.SetStateAction<string>>
}) => {
    const { authLoading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            password: '',
            role: 'jobseeker'
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await dispatch(registration(data)).unwrap()
            setEmail(data.email)
            setVerified(true)
        } catch (error: any) {
            toast.error(error.message)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-black">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100"
            >
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create Your <span className="text-blue-600">CareerSync</span> Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Join us and start your journey today!
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name Field */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    type="text"
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
                                    })}
                                    type="email"
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>}
                        </div>

                        {/* Phone Number Field (BD Format) */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("phone_number", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^(?:\+88|88)?(01[3-9]\d{8})$/,
                                            message: "Enter a valid BD phone number"
                                        }
                                    })}
                                    type="tel"
                                    className={`block w-full pl-10 pr-3 py-3 border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition`}
                                    placeholder="017XXXXXXXX"
                                />
                            </div>
                            {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number.message as string}</p>}
                        </div>

                        {/* Role Selection */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">I am a</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition ${errors.role ? 'border-red-500' : 'hover:bg-blue-50 border-gray-200'}`}>
                                    <input {...register("role", { required: "Please select a role" })} type="radio" value="jobseeker" className="hidden peer" />
                                    <div className="flex flex-col items-center peer-checked:text-blue-600">
                                        <UserCheck className="h-6 w-6 mb-1" />
                                        <span className="text-sm font-medium">Job Seeker</span>
                                    </div>
                                </label>
                                <label className={`flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition ${errors.role ? 'border-red-500' : 'hover:bg-blue-50 border-gray-200'}`}>
                                    <input {...register("role", { required: "Please select a role" })} type="radio" value="recruiter" className="hidden peer" />
                                    <div className="flex flex-col items-center peer-checked:text-blue-600">
                                        <Briefcase className="h-6 w-6 mb-1" />
                                        <span className="text-sm font-medium">Recruiter</span>
                                    </div>
                                </label>
                            </div>
                            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message as string}</p>}
                        </div>

                        {/* Password Field */}
                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 8, message: "At least 8 characters" },
                                        pattern: {
                                            value: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                                            message: "Must include a letter and a number"
                                        }
                                    })}
                                    type="password"
                                    className={`block w-full pl-10 pr-10 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message as string}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        disabled={authLoading}
                        type="submit"
                        className="w-full flex cursor-pointer disabled:cursor-default items-center justify-center py-4 px-4 border border-transparent text-md font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition duration-200 disabled:opacity-70 shadow-lg shadow-blue-200"
                    >
                        {authLoading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Get Started <ChevronRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPageDesign;