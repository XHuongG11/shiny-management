import ApiService from './ApiService'

export async function apiGetAccountSettingData<T>() {
    return ApiService.fetchData<T>({
        url: '/account/setting',
        method: 'get',
    })
}
export async function apiChangePassword<T>(data: {
    oldPassword: string
    newPassword: string
}) {
    return ApiService.fetchData<T>({
        url: '/users/change-password',
        method: 'post',
        params: data,
    })
}
