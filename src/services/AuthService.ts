import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
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

// export async function apiSignOut() {
//     return ApiService.fetchData({
//         url: '/sign-out',
//         method: 'post',
//     })
// }

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: '/reset-password',
        method: 'post',
        data,
    })
}
