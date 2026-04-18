export interface registrationType {
    name: string
    email: string
    password: string
    phone_number: string
    role: 'jobseeker' | 'recruiter'
}

export interface verifyType {
    email: string
    otp: string
}

export interface loginType {
    email: string
    password: string
}

export interface emailType {
    email: string
}

export interface resendOtpType {
    email: string
    mailType: 'registration' | 'forgetPass'
}

export interface userType {
    _id: number;
    name: string;
    email: string;
    phone_number: string;
    role: 'jobseeker' | 'recruiter';
    bio?: string | null;
    resume?: string | null;
    profile_pic?: string | null;
    created_at: string
    subscription?: string | null;
}