import { useEffect, useMemo, useRef, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import {
    getCustomers,
    searchCustomers,
    setTableData,
    useAppDispatch,
    useAppSelector,
    deactivateCustomer,
    activateCustomer,
    setSelectedCustomer,
} from '../store'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'
import { Customer } from '@/@types/customer'
import { HiOutlineBan, HiOutlineCheckCircle, HiOutlineEye, HiOutlineLockClosed } from 'react-icons/hi'
import { Tooltip } from '@/components/ui'
import { toggleBanConfirmation } from '../../StaffManagement/store'

const StatusColumn = ({ status }: { status: string }) => {
    let color = ''
    let label = status
    
    switch(status) {
        case 'ACTIVE':
            color = 'bg-emerald-500'
            label = 'ACTIVE'
            break
        case 'BANNED':
            color = 'bg-red-500'
            label = 'BANNED'
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
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sort]);

    
    const tableData = useMemo(
        () => ({ page, size, sort, totalPages, title }),
        [page, size, sort, totalPages, title]
    );
    

    const fetchData = () => {
        if (tableData.title && tableData.title.length >= 1) {
            dispatch(searchCustomers({ page: tableData.page as number, size: tableData.size as number, name: tableData.title as string }));
        }
        else {
            dispatch(getCustomers({ page: tableData.page as number, size: tableData.size as number}));
        }
    };

    const columns: ColumnDef<Customer>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (props) => <span>{props.row.original.id}</span>,
            },
            {
                header: 'Full Name',
                accessorKey: 'full_name',
                cell: (props) => <span className="font-semibold">{props.row.original.fullName}</span>,
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => <span>{props.row.original.email}</span>,
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => <span>{props.row.original.phone}</span>,
            },
            {
                header: 'Username',
                accessorKey: 'username',
                cell: (props) => <span>{props.row.original.username}</span>,
            },
            {
                header: 'Gender',
                accessorKey: 'gender',
                cell: (props) => (
                    <span>{props.row.original.gender === 'MALE' ? 'Male' : 'Female'}</span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => <StatusColumn status={props.row.original.status as string} />,
            },
            {
                header: 'Join Date',
                accessorKey: 'join_at',
                cell: (props) => (
                    <span>{dayjs(props.row.original.joinAt).format('DD/MM/YYYY')}</span>
                ),
            },
{
                header: 'Action',
                accessorKey: 'action',
                id: 'action',
                cell: (props) => {
                    const cus = props.row.original;
                    const isActive = cus.status === 'ACTIVE';

                    const onBanUnbanClick = () => {
                        dispatch(toggleBanConfirmation(true));
                        dispatch(setSelectedCustomer(cus));
                    };

                    return (
                        <div className="flex justify-end">
                            <Tooltip title={isActive ? "Ban Staff" : "Unban Staff"}>
                                <span
                                    className={`cursor-pointer p-2 ${isActive ? 'hover:text-amber-500' : 'hover:text-emerald-500'}`}
                                    onClick={onBanUnbanClick}
                                >
                                    {isActive ? <HiOutlineBan /> : <HiOutlineCheckCircle />}
                                </span>
                            </Tooltip>
                        </div>
                    );
                },
            },
        ],
        [dispatch]
    );

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

export default CustomersTable