"use client"

import Loader from '@/components/loading/FirstLoad'
import { RootState } from '@/store/store'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const { user, fetchUser } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (fetchUser && user) {
            router.push('/')
        }
    }, [fetchUser, user, router])

    return (
        <>
            <AnimatePresence mode="wait">
                {!fetchUser ? (
                    <Loader key="loader" />
                ) : (
                    <div className="w-full">
                        {children}
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AuthProvider