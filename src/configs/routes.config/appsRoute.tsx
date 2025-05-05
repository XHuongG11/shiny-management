import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { MANAGER, STAFF } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'appsCrm.customers',
        path: `${APP_PREFIX_PATH}/crm/customers`,
        component: lazy(() => import('@/views/crm/Customers')),
        authority: [MANAGER, STAFF],
        meta: {
            header: 'Customers',
        },
    },
    {
        key: 'appsCrm.customerDetails',
        path: `${APP_PREFIX_PATH}/crm/customer-details`,
        component: lazy(() => import('@/views/crm/CustomerDetail')),
        authority: [MANAGER, STAFF],
        meta: {
            header: 'Customer Details',
            headerContainer: true,
        },
    },
    {
        key: 'appsCrm.mail',
        path: `${APP_PREFIX_PATH}/crm/mail`,
        component: lazy(() => import('@/views/crm/Mail')),
        authority: [MANAGER, STAFF],
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'appsCrm.mail',
        path: `${APP_PREFIX_PATH}/crm/mail/:category`,
        component: lazy(() => import('@/views/crm/Mail')),
        authority: [MANAGER, STAFF],
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'appsCrm.staffList',
        path: `${APP_PREFIX_PATH}/crm/staff-list`,
        component: lazy(
            () => import('@/views/crm/StaffManagement/StaffManagement'),
        ),
        authority: [MANAGER],
        meta: {
            header: 'Staff Management',
        },
    },
    {
        key: 'appsSales.dashboard',
        path: `${APP_PREFIX_PATH}/sales/dashboard`,
        component: lazy(() => import('@/views/sales/SalesDashboard')),
        authority: [MANAGER],
    },
    {
        key: 'appsSales.productList',
        path: `${APP_PREFIX_PATH}/sales/product-list`,
        component: lazy(() => import('@/views/sales/ProductList')),
        authority: [MANAGER],
    },
    {
        key: 'appsSales.productEdit',
        path: `${APP_PREFIX_PATH}/sales/product-edit/:productId`,
        component: lazy(() => import('@/views/sales/ProductEdit')),
        authority: [MANAGER],
        meta: {
            header: 'Edit Product',
        },
    },
    {
        key: 'appsSales.productDetail',
        path: `${APP_PREFIX_PATH}/sales/product-detail/:productId`,
        component: lazy(() => import('@/views/sales/ProductDetail')),
        authority: [MANAGER],
        meta: {
            header: 'Detail Product',
        },
    },
    {
        key: 'appsSales.productNew',
        path: `${APP_PREFIX_PATH}/sales/product-new`,
        component: lazy(() => import('@/views/sales/ProductNew')),
        authority: [MANAGER],
        meta: {
            header: 'Add New Product',
        },
    },
    {
        key: 'appsSales.orderList',
        path: `${APP_PREFIX_PATH}/sales/order-list`,
        component: lazy(() => import('@/views/sales/OrderList')),
        authority: [STAFF],
    },
    {
        key: 'appsSales.orderDetails',
        path: `${APP_PREFIX_PATH}/sales/order-details/:orderId`,
        component: lazy(() => import('@/views/sales/OrderDetails')),
        authority: [STAFF],
    },
    {
        key: 'appsSales.returnProcessing',
        path: `${APP_PREFIX_PATH}/sales/order-details/return/:orderId`,
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
        path: `${APP_PREFIX_PATH}/sales/reviews`,
        component: lazy(() => import('@/views/sales/ReviewList')),
        authority: [STAFF],
    },
    {
        key: 'appsSales.vouchers',
        path: `${APP_PREFIX_PATH}/sales/vouchers`,
        component: lazy(() => import('@/views/sales/VoucherList')),
        authority: [MANAGER],
        meta: {
            header: 'Voucher Management',
        },
    },
    {
        key: 'appsSales.voucherAdd',
        path: `${APP_PREFIX_PATH}/sales/vouchers/add`,
        component: lazy(() => import('@/views/sales/VoucherAdd')),
        authority: [MANAGER],
        meta: {
            header: 'Add New Voucher',
            headerContainer: true,
        },
    },
    {
        key: 'appsSales.voucherEdit',
        path: `${APP_PREFIX_PATH}/sales/vouchers/:voucherId`,
        component: lazy(() => import('@/views/sales/VoucherEdit')),
        authority: [MANAGER],
        meta: {
            header: 'Edit Voucher',
            headerContainer: true,
        },
    },
    {
        key: 'appsSales.catalogManagement',
        path: `${APP_PREFIX_PATH}/sales/catalog-management`,
        component: lazy(() => import('@/views/sales/CatalogManagement')),
        authority: [MANAGER],
    },
    {
        key: 'appsknowledgeBase.helpCenter',
        path: `${APP_PREFIX_PATH}/knowledge-base/help-center`,
        component: lazy(() => import('@/views/knowledge-base/HelpCenter')),
        authority: [MANAGER, STAFF],
        meta: {
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'appsknowledgeBase.article',
        path: `${APP_PREFIX_PATH}/knowledge-base/article`,
        component: lazy(() => import('@/views/knowledge-base/Article')),
        authority: [MANAGER, STAFF],
    },
    {
        key: 'appsknowledgeBase.manageArticles',
        path: `${APP_PREFIX_PATH}/knowledge-base/manage-articles`,
        component: lazy(() => import('@/views/knowledge-base/ManageArticles')),
        authority: [MANAGER, STAFF],
        meta: {
            header: 'Manage Articles',
            extraHeader: lazy(
                () =>
                    import(
                        '@/views/knowledge-base/ManageArticles/components/PanelHeader'
                    ),
            ),
            headerContainer: true,
        },
    },
    {
        key: 'appsknowledgeBase.editArticle',
        path: `${APP_PREFIX_PATH}/knowledge-base/edit-article`,
        component: lazy(() => import('@/views/knowledge-base/EditArticle')),
        authority: [MANAGER, STAFF],
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
