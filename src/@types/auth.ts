export type SignInCredential = {
    email: string
    password: string
    role: string
}
export type ApiResponse<T> = {
    code: string
    message: string
    data: T
}
export type SignInResponse = {
    user: {
        username: string
        email: string
        phone: string
        fullName: string
        dob: string
        gender: string
        status: string
        role: string
    }
    token: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
    role: string
}

export type ResetPassword = {
    password: string
}


