import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    SignInResponse,
    SignUpResponse,
    ApiResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    if (data.role === 'STAFF')
        return ApiService.fetchData<ApiResponse<SignInResponse>>({
            url: '/auth/login',
            method: 'post',
            data,
        })
    else if (data.role === 'MANAGER')
        return ApiService.fetchData<ApiResponse<SignInResponse>>({
            url: '/auth/login',
            method: 'post',
            data,
        })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/sign-up',
        method: 'post',
        data,
    })
}

export async function apiSendEmailResetPassword<
    T extends Record<string, unknown>,
>(data: ForgotPassword) {
    return ApiService.fetchData<T>({
        url: '/auth/reset-password/send-email',
        method: 'post',
        params: data,
    })
}
export async function apiVerifyResetPassword<T extends Record<string, unknown>>(
    data: ForgotPassword,
) {
    return ApiService.fetchData<T>({
        url: '/auth/reset-password/verify',
        method: 'post',
        data,
    })
}
