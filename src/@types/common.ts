import { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    totalPages?: number
    page?: number
    size?: number
    title?: string
    sort?: {
        order: 'asc' | 'desc' | ''
        key: string | number
    }
}
