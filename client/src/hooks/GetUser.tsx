"use client"

import { getUser } from '@/store/slice/authSlice'
import { AppDispatch } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const GetUser = () => {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(getUser(null)).unwrap()
            .catch(() => { })
    }, [])
    return null
}

export default GetUser