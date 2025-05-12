import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { MANAGER, STAFF } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'appsCrm.customers',
        path: `${APP_PREFIX_PATH}/customers`,
        component: lazy(() => import('@/views/crm/Customers')),
        authority: [MANAGER, STAFF],
    },
    {
        key: 'appsCrm.staffManagement',
        path: `${APP_PREFIX_PATH}/staffs`,
        component: lazy(() => import('@/views/crm/StaffManagement')),
        authority: [MANAGER, STAFF],
    },
    {
        key: 'appsCrm.staffManagement',
        path: `${APP_PREFIX_PATH}/staffs/:sid`,
        component: lazy(() => import('@/views/crm/StaffEdit')),
        authority: [MANAGER, STAFF],
    },
    {
        key: 'appsCrm.staffManagement',
        path: `${APP_PREFIX_PATH}/staffs/add`,
        component: lazy(() => import('@/views/crm/StaffAdd')),
        authority: [MANAGER, STAFF],
    },
    {
        key: 'appsSales.dashboard',
        path: `${APP_PREFIX_PATH}/dashboard`,
        component: lazy(() => import('@/views/sales/SalesDashboard')),
        authority: [MANAGER],
    },
    {
        key: 'appsSales.productList',
        path: `${APP_PREFIX_PATH}/products`,
        component: lazy(() => import('@/views/sales/ProductList')),
        authority: [MANAGER],
    },
    {
        key: 'appsSales.productEdit',
        path: `${APP_PREFIX_PATH}/edit/:productId`,
        component: lazy(() => import('@/views/sales/ProductEdit')),
        authority: [MANAGER],
        meta: {
            header: 'Edit Product',
        },
    },
    {
        key: 'appsSales.productDetail',
        path: `${APP_PREFIX_PATH}/product-detail/:productId`,
        component: lazy(() => import('@/views/sales/ProductDetail')),
        authority: [MANAGER],
        meta: {
            header: 'Product Detail',
        },
    },
    {
        key: 'appsSales.productNew',
        path: `${APP_PREFIX_PATH}/product-new`,
        component: lazy(() => import('@/views/sales/ProductNew')),
        authority: [MANAGER],
        meta: {
            header: 'Add New Product',
        },
    },
    {
        key: 'appsSales.orderList',
        path: `${APP_PREFIX_PATH}/orders`,
        component: lazy(() => import('@/views/sales/OrderList')),
        authority: [STAFF],
    },
    {
        key: 'appsSales.orderDetails',
        path: `${APP_PREFIX_PATH}/order-details/:orderId`,
        component: lazy(() => import('@/views/sales/OrderDetails')),
        authority: [STAFF],
    },
    {
        key: 'appsSales.returnProcessing',
        path: `${APP_PREFIX_PATH}/order-details/return/:orderId`,
        component: lazy(
            () =>
                import(
                    '@/views/sales/OrderDetails/components/ReturnProcessingPage'
                ),
        ),
        authority: [STAFF],
        meta: {
            header: 'Process Return',
        },
    },
    {
        key: 'appsSales.reviews',
        path: `${APP_PREFIX_PATH}/reviews`,
        component: lazy(() => import('@/views/sales/ReviewList')),
        authority: [STAFF],
    },
    {
        key: 'appsSales.vouchers',
        path: `${APP_PREFIX_PATH}/vouchers`,
        component: lazy(() => import('@/views/sales/VoucherList')),
        authority: [MANAGER],
    },
    {
        key: 'appsSales.voucherAdd',
        path: `${APP_PREFIX_PATH}/vouchers/add`,
        component: lazy(() => import('@/views/sales/VoucherAdd')),
        authority: [MANAGER],
        meta: {
            header: 'Add New Voucher',
            headerContainer: true,
        },
    },
    {
        key: 'appsSales.voucherEdit',
        path: `${APP_PREFIX_PATH}/vouchers/:voucherId`,
        component: lazy(() => import('@/views/sales/VoucherEdit')),
        authority: [MANAGER],
        meta: {
            header: 'Edit Voucher',
            headerContainer: true,
        },
    },
    {
        key: 'appsSales.catalogManagement',
        path: `${APP_PREFIX_PATH}/catalogs`,
        component: lazy(() => import('@/views/sales/CatalogManagement')),
        authority: [MANAGER],
    },
    {
        key: 'appsSales.webContent',
        path: `${APP_PREFIX_PATH}/web-content`,
        component: lazy(() => import('@/views/sales/WebContent')),
        authority: [MANAGER],
    }, 
    {
        key: 'appsAccount.settings',
        path: `${APP_PREFIX_PATH}/account/settings/:tab`,
        component: lazy(() => import('@/views/account/Settings')),
        authority: [MANAGER, STAFF],
        meta: {
            header: 'Settings',
            headerContainer: true,
        },
    },
]

export default appsRoute
