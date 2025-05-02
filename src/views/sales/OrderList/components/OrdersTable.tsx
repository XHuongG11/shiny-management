import { useEffect, useCallback, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { NumericFormat } from 'react-number-format'
import { HiOutlineEye } from 'react-icons/hi'
import Tooltip from '@/components/ui/Tooltip'
import Badge from '@/components/ui/Badge'
import {
    getOrders,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'

type Order = {
    id: string
    orderDate: string
    shippingAddress: { recipientName: string }
    paymentMethod: string
    status: string
    totalPrice: number
}

const PaymentMethodImage = ({
    paymentMethod,
    className,
}: {
    paymentMethod: string
    className: string
}) => {
    switch (paymentMethod.toLowerCase()) {
        case 'visa':
            return (
                <img
                    className={className}
                    src="/img/others/img-8.png"
                    alt={paymentMethod}
                />
            )
        case 'master':
            return (
                <img
                    className={className}
                    src="/img/others/img-9.png"
                    alt={paymentMethod}
                />
            )
        case 'paypal':
            return (
                <img
                    className={className}
                    src="/img/others/img-10.png"
                    alt={paymentMethod}
                />
            )
        case 'vn-pay':
            return <span className={className}>VN-PAY</span>
        case 'cod':
            return <span className={className}>COD</span>
        default:
            return <span className={className}>{paymentMethod}</span>
    }
}

const statusDisplayMap: Record<
    string,
    { label: string; dotClass: string; textClass: string }
> = {
    RETURN_REQUESTED: {
        label: 'RETURN REQUESTED',
        dotClass: 'bg-purple-500',
        textClass: 'text-purple-500',
    },
    PENDING: {
        label: 'PENDING',
        dotClass: 'bg-orange-500',
        textClass: 'text-orange-500',
    },
    SHIPPING: {
        label: 'SHIPPING',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    CANCELLED: {
        label: 'CANCELLED',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    COMPLETED: {
        label: 'COMPLETED',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    CONFIRMED: {
        label: 'CONFIRMED',
        dotClass: 'bg-lime-500',
        textClass: 'text-lime-500',
    },
    DELIVERED: {
        label: 'DELIVERED',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
    RETURNED: {
        label: 'RETURNED',
        dotClass: 'bg-gray-500',
        textClass: 'text-gray-500',
    },
    RETURN_REJECTED: {
        label: 'RETURN REJECTED',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    UNKNOWN: {
        label: 'UNKNOWN',
        dotClass: 'bg-neutral-400',
        textClass: 'text-neutral-400',
    },
}

const ActionColumn = ({ row }: { row: Order }) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView = useCallback(() => {
        if (row.id) {
            console.log('Navigating to:', `/app/sales/order-details/${row.id}`)
            navigate(`/app/sales/order-details/${row.id}`)
        } else {
            console.error('Order ID is undefined or invalid')
        }
    }, [navigate, row])

    return (
        <div className="flex justify-end text-lg">
            <Tooltip title="View">
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onView}
                >
                    <HiOutlineEye />
                </span>
            </Tooltip>
        </div>
    )
}

const OrdersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { page, size, sort, title, totalPages } = useAppSelector(
        (state) => state.salesOrderList.data.tableData
    )
    const loading = useAppSelector((state) => state.salesOrderList.data.loading)
    const data = useAppSelector((state) => state.salesOrderList.data.orderList)

    const fetchData = useCallback(() => {
        console.log('{ page, size, sort, title }', { page, size, sort, title })
        dispatch(getOrders({ page, size, sort, title }))
    }, [dispatch, page, size, sort, title])

    useEffect(() => {
        console.log('orderList:', data)
        fetchData()
    }, [dispatch, fetchData, page, size, sort])

    const tableData = useMemo(
        () => ({ page, size, sort, title, total: totalPages * size }),
        [page, size, sort, title, totalPages]
    )

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                header: 'Order',
                accessorKey: 'id',
                cell: (props) => {
                    const { id } = props.row.original
                    return (
                        <span
                            className="cursor-pointer select-none font-semibold hover:text-blue-600"
                            onClick={() =>
                                navigate(`/app/sales/order-details/${id}`)
                            }
                        >
                            #{id}
                        </span>
                    )
                },
            },
            {
                header: 'Date',
                accessorKey: 'orderDate',
                cell: (props) => {
                    const { orderDate } = props.row.original
                    return (
                        <span>
                            {dayjs(orderDate).format('DD/MM/YYYY HH:mm')}
                        </span>
                    )
                },
            },
            {
                header: 'Customer',
                accessorKey: 'shippingAddress.recipientName',
                cell: (props) => {
                    const { shippingAddress } = props.row.original
                    return <span>{shippingAddress.recipientName}</span>
                },
            },
            {
                header: 'Payment Method',
                accessorKey: 'paymentMethod',
                cell: (props) => {
                    const { paymentMethod } = props.row.original
                    return (
                        <span className="flex items-center">
                            <PaymentMethodImage
                                className="max-h-[20px]"
                                paymentMethod={paymentMethod}
                            />
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    const statusKey = status in statusDisplayMap ? status : 'UNKNOWN'
                    return (
                        <div className="flex items-center">
                            <Badge className={statusDisplayMap[statusKey].dotClass} />
                            <span
                                className={`ml-2 rtl:mr-2 capitalize font-semibold ${statusDisplayMap[statusKey].textClass}`}
                            >
                                {statusDisplayMap[statusKey].label}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Total',
                accessorKey: 'totalPrice',
                cell: (props) => {
                    const { totalPrice } = props.row.original
                    return (
                        <NumericFormat
                            displayType="text"
                            value={(Math.round(totalPrice * 100) / 100).toFixed(
                                2
                            )}
                            suffix={' VNĐ'}
                            thousandSeparator={true}
                        />
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [navigate]
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.page = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.size = Number(value)
        newTableData.page = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <DataTable
            ref={tableRef}
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: tableData.total as number,
                pageIndex: tableData.page as number,
                pageSize: tableData.size as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
        />
    )
}

export default OrdersTable