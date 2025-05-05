import { lazy } from 'react'
import { PAGES_PREFIX_PATH } from '@/constants/route.constant'
import { MANAGER, STAFF } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const pagesRoute: Routes = [
    {
        key: 'pages.welcome',
        path: `${PAGES_PREFIX_PATH}/welcome`,
        component: lazy(() => import('@/views/pages/Welcome')),
        authority: [MANAGER, STAFF],
    },
    {
        key: 'pages.accessDenied',
        path: '/access-denied',
        component: lazy(() => import('@/views/pages/AccessDenied')),
        authority: [MANAGER, STAFF],
    },
]

export default pagesRoute
