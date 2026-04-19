"use client"

import RegisterPageDesign from '@/components/auth/RegistrationDesign'
import VerifyOtp from '@/components/auth/VerifyOtp'
import React, { useState } from 'react'

const page = () => {
    const [verified, setVerified] = useState(false)
    const [email, setEmail] = useState('')
    return (
        <>
            {
                !verified ? <RegisterPageDesign setVerified={setVerified} setEmail={setEmail} /> :
                    <VerifyOtp email={email} />
            }
        </>
    )
}

export default page