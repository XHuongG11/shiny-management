import BaseService from './BaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((error: AxiosError) => {
                    console.error('Axios caught error:', error)
                    if (error.response) {
                        console.error('Response data:', error.response.data)
                        console.error('Status:', error.response.status)
                    } else if (error.request) {
                        console.error('No response received:', error.request)
                    } else {
                        console.error('Error message:', error.message)
                    }
                    reject(error)
                })
        })
    },
}

export default ApiService
