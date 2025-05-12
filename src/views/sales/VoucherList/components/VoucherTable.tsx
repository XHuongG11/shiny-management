import { useEffect, useMemo, useCallback, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import Tooltip from '@/components/ui/Tooltip'
import {
    getVouchers,
    setTableData,
    setSelectedVoucher,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    searchVouchers,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import type { Voucher, VoucherApplicability } from '@/@types/voucher'

type VoucherTableProps = {
    onEdit: (id: number) => void
}

const getApplicabilityLabel = (applicabilities: VoucherApplicability[]): string => {
    if (!applicabilities || applicabilities.length === 0) return 'ALL'

    const types = new Set(applicabilities.map(item => item.type))
    if (types.has('ALL')) return 'ALL'

    if (types.has('PRODUCT')) return 'Products'
    if (types.has('CATEGORY')) return 'Categories'
    if (types.has('COLLECTION')) return 'Collections'
    if (types.has('CUSTOMER')) return 'Customers'
    
    return 'ALL'
}

const VoucherTypeColumn = ({ type }: { type: string }) => {
    let color = ''
    let label = type
    
    switch(type) {
        case 'PROMOTION':
            color = 'bg-emerald-500'
            label = 'PROMOTION'
            break
        case 'FREESHIP':
            color = 'bg-blue-500'
            label = 'FREESHIP'
            break
        default:
            color = 'bg-gray-500'
            break
    }
    
    return (
        <div className="flex items-center">
            <span className={`${color} w-2.5 h-2.5 rounded-full mr-2`}></span>
            <span>{label}</span>
        </div>
    )
}

const VoucherTable = ({ onEdit }: VoucherTableProps) => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()

    const { page, size, sort, totalPages , title} = useAppSelector(
        (state) => state.salesVoucherList.data.tableData
    )
    const loading = useAppSelector((state) => state.salesVoucherList.data.loading)
    const data = useAppSelector((state) => state.salesVoucherList.data.voucherList)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sort])

    const tableData = useMemo(
        () => ({ page, size, sort, totalPages , title }),
        [page, size, sort, totalPages, title]
    )

    const fetchData = () => {
        if (tableData.title && tableData.title.length > 1) {
            dispatch(searchVouchers({ page: tableData.page as number, size: tableData.size as number, query: tableData.title as string }))
        }
        else {
            dispatch(getVouchers({ page: tableData.page as number, size: tableData.size as number }))
        }
    }

    const columns: ColumnDef<Voucher>[] = useMemo(
        () => [
            {
                header: 'Code',
                accessorKey: 'code',
                cell: (props) => {
                    const { code } = props.row.original
                    return (
                        <span className="font-semibold">{code}</span>
                    )
                }
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const { name } = props.row.original
                    return (
                        <span>{name}</span>
                    )
                }
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => {
                    const { type } = props.row.original
                    return <VoucherTypeColumn type={type} />
                }
            },
            {
                header: 'Applies To',
                accessorKey: 'applicabilities',
                cell: (props) => {
                    const { applicabilities } = props.row.original
                    return <span>{getApplicabilityLabel(applicabilities)}</span>
                }
            },
            {
                header: 'Discount Rate',
                accessorKey: 'discountRate',
                cell: (props) => {
                    const { discountRate } = props.row.original
                    return <span>{discountRate}%</span>
                }
            },
            {
                header: 'Minimum To Apply',
                accessorKey: 'minimumToApply',
                cell: (props) => {
                    const { minimumToApply } = props.row.original
                    return (
                        <NumericFormat
                            displayType="text"
                            value={minimumToApply}
                            suffix={' VNĐ'}
                            thousandSeparator={true}
                        />
                    )
                }
            },
            {
                header: 'Apply Limit',
                accessorKey: 'applyLimit',
                cell: (props) => {
                    const { applyLimit } = props.row.original
                    return (
                        <NumericFormat
                            displayType="text"
                            value={applyLimit}
                            suffix={' VNĐ'}
                            thousandSeparator={true}
                        />
                    )
                }
            },
            {
                header: 'Valid Period',
                accessorKey: 'validPeriod',
                cell: (props) => {
                    const { validFrom, validTo } = props.row.original
                    return (
                        <span>
                            {dayjs(validFrom).format('DD/MM/YYYY')} - {dayjs(validTo).format('DD/MM/YYYY')}
                        </span>
                    )
                }
            },
            {
                header: 'Quantity',
                accessorKey: 'quantity',
                cell: (props) => {
                    const { quantity } = props.row.original
                    return <span>{quantity}</span>
                }
            },
            {
                header: 'Uses Per Customer',
                accessorKey: 'limitUsePerCustomer',
                cell: (props) => {
                    const { limitUsePerCustomer } = props.row.original
                    return <span>{limitUsePerCustomer}</span>
                }
            },
            {
                header: '',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    
                    const onDeleteClick = () => {
                        dispatch(toggleDeleteConfirmation(true))
                        dispatch(setSelectedVoucher(row))
                    }
                    
                    const onEditClick = () => {
                        if (row.id) {
                            onEdit(row.id)
                        }
                    }
                    
                    return (
                        <div className="flex justify-end">
                            <Tooltip title="Edit">
                                <span
                                    className="cursor-pointer p-2 hover:text-blue-500"
                                    onClick={onEditClick}
                                >
                                    <HiOutlinePencil />
                                </span>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <span
                                    className="cursor-pointer p-2 hover:text-red-500"
                                    onClick={onDeleteClick}
                                >
                                    <HiOutlineTrash />
                                </span>
                            </Tooltip>
                        </div>
                    )
                },
            },
        ],
        [dispatch, onEdit]
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

    return (
        <DataTable
            ref={tableRef}
            columns={columns}
            data={data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            loading={loading}
            pagingData={{
                total: tableData.totalPages as number,
                pageIndex: tableData.page as number,
                pageSize: tableData.size as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
        />
    )
}

export default VoucherTable