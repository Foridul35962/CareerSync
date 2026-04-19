"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { ShieldCheck, Loader2, RotateCcw } from 'lucide-react';
import { resendOtp, verifyRegi } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const VerifyOtp = ({ email }: { email: string }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { authLoading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [timer, setTimer] = useState(60)
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length === 6) {
            try {
                await dispatch(verifyRegi({ email, otp: otpString })).unwrap();
                toast.success("Registration verified!");
                router.push('/login');
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    const handleSendOtp = async () => {
        if (!canResend) return;
        try {
            await dispatch(resendOtp({ email, mailType: "registration" })).unwrap();
            toast.success("OTP resend successfully");
            setTimer(60);
            setCanResend(false);
        } catch (error: any) {
            toast.error(error || "Failed to resend OTP");
        }
    };

    return (
        <div className="fixed inset-0 z-100 text-black bg-white flex items-center justify-center overflow-y-auto">
            <div className="max-w-md w-full px-6 py-12 flex flex-col items-center">
                
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 p-4 bg-blue-50 rounded-2xl"
                >
                    <ShieldCheck className="h-12 w-12 text-blue-600" />
                </motion.div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Check Your Email</h1>
                    <p className="text-gray-500 leading-relaxed">
                        We've sent a 6-digit code to <br />
                        <span className="font-semibold text-gray-900 border-b-2 border-blue-100">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerify} className="w-full space-y-10">
                    <div className="flex justify-between gap-2 sm:gap-3">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                ref={(el:any) => (inputRefs.current[index] = el)}
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onFocus={(e) => e.target.select()}
                                className="w-full aspect-square max-w-14 text-2xl font-bold text-center border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={authLoading || otp.join("").length < 6}
                            type="submit"
                            className="w-full py-4 bg-blue-500 cursor-pointer disabled:cursor-default text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-50 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
                        >
                            {authLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Verify & Continue"}
                        </motion.button>

                        <button 
                            type="button"
                            disabled={!canResend}
                            onClick={handleSendOtp}
                            className={`w-full py-3 flex items-center justify-center text-sm font-semibold transition-colors group ${canResend ? 'text-blue-600 hover:text-blue-700  cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                        >
                            <RotateCcw className={`h-4 w-4 mr-2 ${canResend ? 'group-hover:rotate-180' : ''} transition-transform duration-500`} />
                            {canResend ? "Resend Code" : `Resend in ${timer}s`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;