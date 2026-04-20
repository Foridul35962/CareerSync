"use client"

import ForgetPassDesign from '@/components/auth/fogetPass/ForgetPassDesign'
import ResetPass from '@/components/auth/fogetPass/ResetPass'
import VerifyOtp from '@/components/auth/VerifyOtp'
import React, { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('')
    const [verify, setVerify] = useState(false)
    return (
        <>
            {
                !email ? <ForgetPassDesign setEmail={setEmail} /> : (
                    !verify ? <VerifyOtp email={email} setVerify={setVerify} verifyType='forgetPass' /> :
                        <ResetPass email={email} />
                )
            }
        </>
    )
}

export default page