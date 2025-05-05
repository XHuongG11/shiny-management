import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
    getCustomers,
    searchCustomers,
    setTableData,
    setSelectedCustomer,
    setDrawerOpen,
    useAppDispatch,
    useAppSelector,
    deactivateCustomer,
    activateCustomer,
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
import { HiOutlineEye, HiOutlineLockClosed } from 'react-icons/hi'

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

    const handleLockToggle = () => {
        console.log('Row status:', row.status, 'Expected ACTIVE:', EUserStatus.ACTIVE)
        const isActive = row.status === EUserStatus.ACTIVE
        console.log('Is active:', isActive)
        const confirmationMessage = isActive
            ? 'Bạn có muốn khóa tài khoản này không?'
            : 'Bạn có muốn mở khóa tài khoản này không?'
        if (window.confirm(confirmationMessage)) {
            if (isActive) {
                dispatch(deactivateCustomer(row.id))
                    .unwrap()
                    .then((response) => {
                        console.log('Tài khoản đã được khóa:', row.id, 'Response:', response)
                    })
                    .catch((error) => {
                        console.error('Lỗi khi khóa tài khoản:', error)
                    })
            } else {
                dispatch(activateCustomer(row.id))
                    .unwrap()
                    .then((response) => {
                        console.log('Tài khoản đã được mở khóa:', row.id, 'Response:', response)
                    })
                    .catch((error) => {
                        console.error('Lỗi khi mở khóa tài khoản:', error)
                    })
            }
        }
    }

    return (
        <div className="flex space-x-2 rtl:space-x-reverse">
            <div
                className={`${textTheme} cursor-pointer select-none hover:text-red-500`}
                onClick={onDetail}
            >
                <HiOutlineEye/>
            </div>
            <div
                className={`${textTheme} cursor-pointer select-none hover:text-red-500 ${row.status === EUserStatus.ACTIVE ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={handleLockToggle}
                title={row.status === EUserStatus.ACTIVE ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
            >
                <HiOutlineLockClosed />
            </div>
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
    const [searchTrigger, setSearchTrigger] = useState(0)

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
        console.log('Component mounted, dispatching getCustomers')
        dispatch(getCustomers({ page: page, size: 10 }))
    }, [dispatch, page])

    // Trigger search when title changes
    useEffect(() => {
        console.log('Title changed to:', title, 'Triggering search:', searchTrigger)
        setSearchTrigger((prev) => prev + 1)
    }, [title])

    useEffect(() => {
        console.log('Fetching customers with params:', { page, size, title, sort })
        if (title && title.trim()) {
            console.log('Searching customers with name:', title, 'Trigger:', searchTrigger)
            dispatch(searchCustomers({ name: title, page: page, size }))
        } else {
            console.log('Fetching all customers')
            dispatch(getCustomers({ page: page, size }))
        }
    }, [dispatch, page, size, sort, searchTrigger])

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

    console.log('CustomersTable state - data:', data)

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
            {data && data.length === 0 && !loading && (
                <h5>Không tìm thấy khách hàng phù hợp với "{title}".</h5>
            )}
            <CustomerEditDialog />
        </>
    )
}

export default CustomersTable