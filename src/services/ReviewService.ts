import { TableQueries } from "@/@types/common";
import ApiService from "./ApiService";

export async function apiGetProductReviews<T>(data: {page: number; size: number}) {
    return ApiService.fetchData<T>({
        url: '/reviews/all',
        method: 'get',
        params: data,
    })
}

export async function apiRespondToReview<T>(data: { reviewId: number; content: string }) {
    return ApiService.fetchData<T>({
        url: `/reviews/add-response`,
        method: 'post',
        data: { 
            content: data.content ,
            reviewId: data.reviewId
        },
    })
}