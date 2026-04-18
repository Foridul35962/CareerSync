"use client"

import store from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Provider store={store}>
                <ToastContainer />
                {children}
            </Provider>
        </>
    )
}

export default AppProvider