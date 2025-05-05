import { useEffect, useMemo, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
    getCustomers,
    setTableData,
    setSelectedCustomer,
    setDrawerOpen,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import CustomerEditDialog from './CustomerEditDialog'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { Customer, EUserStatus } from '@/@types/customer'

const statusColor: Record<string, string> = {
    [EUserStatus.ACTIVE]: 'bg-emerald-500',
    [EUserStatus.INACTIVE]: 'bg-red-500',
}

const ActionColumn = ({ row }: { row: Customer }) => {
    const { textTheme } = useThemeClass()
    const dispatch = useAppDispatch()

    const onDetail = () => {
        dispatch(setDrawerOpen())
        dispatch(setSelectedCustomer(row))
    }

    return (
        <div
            className={`${textTheme} cursor-pointer select-none font-semibold`}
            onClick={onDetail}
        >
            Detail
        </div>
    )
}

const NameColumn = ({ row }: { row: Customer }) => {
    const { textTheme } = useThemeClass()

    return (
        <div className="flex items-center">
            {/* <Avatar size={28} shape="circle" src={row.avatar || '/img/default-avatar.png'} /> */}
            <Link
                className={`hover:${textTheme} ml-2 rtl:mr-2 font-semibold`}
                to={`/app/crm/customer-details?id=${row.id}`}
            >
                {row.fullName}
            </Link>
        </div>
    )
}

const CustomersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { page, size, sort, title, totalPages } = useAppSelector(
        (state) => state.crmCustomers.data.tableData
    )

    const loading = useAppSelector(
        (state) => state.crmCustomers.data.loading
    )

    const data = useAppSelector(
        (state) => state.crmCustomers.data.customerList
    )

    useEffect(() => {
        console.log('Fetching customers with params:', { page, size, title, sort })
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sort, title])

    const fetchData = () => {
        dispatch(getCustomers({ page, size }))
    }

    const tableData = useMemo(
        () => ({ page, size, sort, title, totalPages }),
        [page, size, sort, title, totalPages]
    )

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'fullName',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Badge className={statusColor[row.status]} />
                            <span className="ml-2 rtl:mr-2 capitalize">
                                {row.status}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Join Date',
                accessorKey: 'dob',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            {row.dob ? dayjs(row.dob).format('MM/DD/YYYY') : 'N/A'}
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
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

    console.log('CustomersTable state:', { data, tableData, loading })

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data || []}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={loading}
                pagingData={{
                    total: tableData.totalPages || 0,
                    pageIndex: tableData.page || 1,
                    pageSize: tableData.size || 10,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            {data && data.length === 0 && <h5>Không tìm thấy khách hàng phù hợp.</h5>}
            <CustomerEditDialog />
        </>
    )
}

export default CustomersTable