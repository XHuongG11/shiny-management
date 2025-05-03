import { ApiResponse } from '@/@types/auth'
import {
    apiGetLatestOrders,
    apigetMonthlyRevenue,
    apiGetNewCustomers,
    apiGetProductSoldByCategory,
    apiGetRevenueByCategory,
    apiGetTopSellingProduct,
    apiGetTotalOrders,
    apiGetTotalReturnOrders,
    apiGetTotalRevenue,
} from '@/services/SalesService'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

export type DashboardData = {
    salesTotal: {
        revenue?: number
        orders?: number
        customers?: number
        returnOrders?: number
    }
    salesReportData?: {
        series: {
            name: string
            data: number[]
        }[]
        categories?: {
            month: number
            categoryRevenueItems: {
                categoryId: number
                categoryName: string
                revenue: number
            }[]
        }[]
    }
    topProductsData?: {
        id: string
        name: string
        img: string
        sold: number
    }[]
    latestOrderData?: {
        id: string
        date: number
        customer: string
        status: string
        paymentMethod: string
        totalAmount: number
    }[]
    salesByCategoriesData?: {
        labels: string[]
        data: number[]
    }
}

export type SalesDashboardState = {
    month: number
    year: number
    loading: boolean
    dashboardData: DashboardData
}

export const SLICE_NAME = 'salesDashboard'

export const getSalesDashboardData = createAsyncThunk<
    DashboardData,
    { month: number; year: number }
>(SLICE_NAME + '/getSalesDashboardData', async ({ month, year }) => {
    const revenueResp = await apiGetTotalRevenue<ApiResponse<number>>({
        month,
        year,
    })
    const totalOrdersResp = await apiGetTotalOrders<ApiResponse<number>>({
        month,
        year,
    })
    const newCustomerResp = await apiGetNewCustomers<ApiResponse<number>>({
        month,
        year,
    })
    const totalReturnOrdersResp = await apiGetTotalReturnOrders<
        ApiResponse<number>
    >({
        month,
        year,
    })
    const productSoldByCatResp = await apiGetProductSoldByCategory<
        ApiResponse<
            {
                categoryId: number
                categoryName: string
                totalSales: number
            }[]
        >
    >({
        month,
        year,
    })
    const topSellingProductResp = await apiGetTopSellingProduct<
        ApiResponse<
            {
                productId: string
                productTitle: string
                productImage: string
                totalQuantity: number
            }[]
        >
    >({
        month,
        year,
    })
    const latestOrders = await apiGetLatestOrders<
        ApiResponse<
            {
                id: string
                totalProductPrice: number
                shippingAddress: {
                    id: number
                    recipientName: string
                    recipientPhone: string
                    province: string
                    district: string
                    village: string
                    address: string
                    default: boolean
                }
                shippingMethod: string
                shippingFee: number
                totalPrice: number
                freeShipDiscount: number
                promotionDiscount: number
                paymentMethod: string
                status: string
                note: string
                orderDate: string
                reviewed: boolean
            }[]
        >
    >({
        month,
        year,
    })
    const monthlyRevenue = await apigetMonthlyRevenue<
        ApiResponse<Array<{ month: number; revenue: number }>>
    >({
        year,
    })
    const categoriesRevenue = await apiGetRevenueByCategory<
        ApiResponse<
            {
                month: number
                categoryRevenueItems: {
                    categoryId: number
                    categoryName: string
                    revenue: number
                }[]
            }[]
        >
    >({
        year,
    })
    return {
        salesTotal: {
            revenue: revenueResp.data.data ?? 0,
            orders: totalOrdersResp.data.data ?? 0,
            customers: newCustomerResp.data.data ?? 0,
            returnOrders: totalReturnOrdersResp.data.data ?? 0,
        },
        salesReportData: {
            series: monthlyRevenue.data.data.map((item) => ({
                name: item.month.toString(),
                data: [item.revenue],
            })),
            categories: categoriesRevenue.data.data.map((item) => ({
                month: item.month,
                categoryRevenueItems: item.categoryRevenueItems.map((cat) => ({
                    categoryId: cat.categoryId,
                    categoryName: cat.categoryName,
                    revenue: cat.revenue,
                })),
            })),
        },
        topProductsData: topSellingProductResp.data.data.map((item) => ({
            id: item.productId,
            name: item.productTitle,
            img: item.productImage,
            sold: item.totalQuantity,
        })),
        salesByCategoriesData: productSoldByCatResp.data.data.reduce(
            (acc: { labels: string[]; data: number[] }, item) => {
                acc.labels.push(item.categoryName)
                acc.data.push(item.totalSales)
                return acc
            },
            { labels: [], data: [] },
        ),
        latestOrderData: latestOrders.data.data.map((item) => ({
            id: item.id,
            date: dayjs(item.orderDate).unix(),
            customer: item.shippingAddress.recipientName,
            status: item.status,
            paymentMethod: item.paymentMethod,
            totalAmount: item.totalPrice,
        })),
    }
})

const initialState: SalesDashboardState = {
    month: dayjs().month() + 1,
    year: dayjs().year(),
    loading: true,
    dashboardData: {
        salesTotal: {
            revenue: 0,
            orders: 100,
            customers: 10,
            returnOrders: 0,
        },
    },
}

const salesDashboardSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setMonth: (state, action: PayloadAction<number>) => {
            state.month = action.payload
        },
        setYear: (state, action: PayloadAction<number>) => {
            state.year = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSalesDashboardData.fulfilled, (state, action) => {
                state.dashboardData = action.payload
                state.loading = false
            })
            .addCase(getSalesDashboardData.pending, (state) => {
                state.loading = true
            })
    },
})

export const { setMonth, setYear } = salesDashboardSlice.actions

export default salesDashboardSlice.reducer
