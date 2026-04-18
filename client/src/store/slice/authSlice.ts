import { emailType, loginType, registrationType, resendOtpType, userType, verifyType } from "@/types/authTypes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth`

export const registration = createAsyncThunk(
    "auth/regi",
    async (data: registrationType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/registration`, data)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const verifyRegi = createAsyncThunk(
    "auth/verify-regi",
    async (data: verifyType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/verify-regi`, data)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async (data: loginType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/login`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async (_: null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/logout`, {
                withCredentials: true
            })
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const forgetPass = createAsyncThunk(
    "auth/forgetPass",
    async (data: emailType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/forget-pass`, data)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const verifyForgetPass = createAsyncThunk(
    "auth/verify-forget-pass",
    async (data: verifyType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/verify-forget-pass`, data)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const resetPass = createAsyncThunk(
    "auth/resetPass",
    async (data: loginType, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/reset-pass`, data)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async (data: resendOtpType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/resend-otp`, data)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface initialStateType {
    authLoading: boolean
    resendOtpLoading: boolean
    user: userType | null
}

const initialState: initialStateType = {
    authLoading: false,
    resendOtpLoading: false,
    user: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //registration
        builder
            .addCase(registration.pending, (state) => {
                state.authLoading = true
            })
            .addCase(registration.fulfilled, (state) => {
                state.authLoading = false
            })
            .addCase(registration.rejected, (state) => {
                state.authLoading = false
            })
        //verify regi
        builder
            .addCase(verifyRegi.pending, (state) => {
                state.authLoading = true
            })
            .addCase(verifyRegi.fulfilled, (state) => {
                state.authLoading = false
            })
            .addCase(verifyRegi.rejected, (state) => {
                state.authLoading = false
            })
        //login
        builder
            .addCase(login.pending, (state) => {
                state.authLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.authLoading = false
                state.user = action.payload.data
            })
            .addCase(login.rejected, (state) => {
                state.authLoading = false
            })
        //logout
        builder
            .addCase(logout.pending, (state) => {
                state.authLoading = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.authLoading = false
                state.user = null
            })
            .addCase(logout.rejected, (state) => {
                state.authLoading = false
            })
        //verify forget pass
        builder
            .addCase(verifyForgetPass.pending, (state) => {
                state.authLoading = true
            })
            .addCase(verifyForgetPass.fulfilled, (state) => {
                state.authLoading = false
            })
            .addCase(verifyForgetPass.rejected, (state) => {
                state.authLoading = false
            })
        //reset pass
        builder
            .addCase(resetPass.pending, (state) => {
                state.authLoading = true
            })
            .addCase(resetPass.fulfilled, (state) => {
                state.authLoading = false
            })
            .addCase(resetPass.rejected, (state) => {
                state.authLoading = false
            })
        //resend otp
        builder
            .addCase(resendOtp.pending, (state) => {
                state.resendOtpLoading = true
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.resendOtpLoading = false
            })
            .addCase(resendOtp.rejected, (state) => {
                state.resendOtpLoading = false
            })
    }
})