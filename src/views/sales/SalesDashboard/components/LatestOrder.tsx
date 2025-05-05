import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import useThemeClass from '@/utils/hooks/useThemeClass'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useCallback } from 'react'
import { NumericFormat } from 'react-number-format'
import { useNavigate } from 'react-router-dom'

type Order = {
    id: string
    date: number
    customer: string
    status: string
    paymentMethod: string
    totalAmount: number
}

type LatestOrderProps = {
    data?: Order[]
    className?: string
}

type OrderColumnPros = {
    row: Order
}

const { Tr, Td, TBody, THead, Th } = Table

const orderStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    CANCELLED: {
        label: 'Cancelled',
        dotClass: 'bg-gray-500',
        textClass: 'text-gray-500',
    },
    COMPLETED: {
        label: 'Completed',
        dotClass: 'bg-emerald-600',
        textClass: 'text-emerald-600',
    },
    CONFIRMED: {
        label: 'Confirmed',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
    DELIVERED: {
        label: 'Delivered',
        dotClass: 'bg-green-500',
        textClass: 'text-green-500',
    },
    PENDING: {
        label: 'Pending',
        dotClass: 'bg-yellow-500',
        textClass: 'text-yellow-500',
    },
    RETURNED: {
        label: 'Returned',
        dotClass: 'bg-purple-500',
        textClass: 'text-purple-500',
    },
    RETURN_REQUESTED: {
        label: 'Return Requested',
        dotClass: 'bg-orange-400',
        textClass: 'text-orange-400',
    },
    RETURN_REJECTED: {
        label: 'Return Rejected',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    SHIPPING: {
        label: 'Shipping',
        dotClass: 'bg-cyan-500',
        textClass: 'text-cyan-500',
    },
}

const OrderColumn = ({ row }: OrderColumnPros) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView = useCallback(() => {
        navigate(`${APP_PREFIX_PATH}/order-details/${row.id}`)
    }, [navigate, row])

    return (
        <span
            className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
            onClick={onView}
        >
            #{row.id}
        </span>
    )
}

const columnHelper = createColumnHelper<Order>()

const columns = [
    columnHelper.accessor('id', {
        header: 'Order',
        cell: (props) => <OrderColumn row={props.row.original} />,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => {
            const { status } = props.row.original
            return (
                <div className="flex items-center">
                    <Badge className={orderStatusColor[status].dotClass} />
                    <span
                        className={`ml-2 rtl:mr-2 capitalize font-semibold ${orderStatusColor[status].textClass}`}
                    >
                        {orderStatusColor[status].label}
                    </span>
                </div>
            )
        },
    }),
    columnHelper.accessor('date', {
        header: 'Date',
        cell: (props) => {
            const row = props.row.original
            return <span>{dayjs.unix(row.date).format('DD/MM/YYYY')}</span>
        },
    }),
    columnHelper.accessor('customer', {
        header: 'Customer',
    }),
    columnHelper.accessor('paymentMethod', {
        header: 'Payment Method',
    }),
    columnHelper.accessor('totalAmount', {
        header: 'Total Price',
        cell: (props) => {
            const { totalAmount } = props.row.original
            return (
                <NumericFormat
                    displayType="text"
                    value={(Math.round(totalAmount * 100) / 100).toFixed(2)}
                    prefix={'VND '}
                    thousandSeparator={true}
                />
            )
        },
    }),
]

const LatestOrder = ({ data = [], className }: LatestOrderProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card className={className}>
            <div className="flex items-center justify-between mb-6">
                <h4>Latest Orders</h4>
                {/* <Button size="sm">View Orders</Button> */}
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
        </Card>
    )
}

export default LatestOrder
