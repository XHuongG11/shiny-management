import React, { useEffect, useMemo, useRef } from 'react';
import DataTable from '@/components/shared/DataTable';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineBan, HiOutlineCheckCircle } from 'react-icons/hi';
import Tooltip from '@/components/ui/Tooltip';
import dayjs from 'dayjs';
import {
    getStaffs,
    setTableData,
    setSelectedStaff,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    searchStaffs,
    toggleBanConfirmation,
} from '../store';
import cloneDeep from 'lodash/cloneDeep';
import type { DataTableResetHandle, ColumnDef } from '@/components/shared/DataTable';
import { Staff } from '@/@types/staff';

type StaffTableProps = {
    onEdit: (id: number) => void;
};

const StaffStatusColumn = ({ status }: { status: string }) => {
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

const StaffTable = ({ onEdit } : StaffTableProps) => {
    const tableRef = useRef<DataTableResetHandle>(null);
    const dispatch = useAppDispatch();

    const { page, size, sort, totalPages, title } = useAppSelector(
        (state) => state.staffManagement.data.tableData
    );

    const loading = useAppSelector((state) => state.staffManagement.data.loading);
    const data = useAppSelector((state) => state.staffManagement.data.staffList);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sort]);

    const tableData = useMemo(
        () => ({ page, size, sort, totalPages, title }),
        [page, size, sort, totalPages, title]
    );

    const fetchData = () => {
        if (tableData.title && tableData.title.length > 1) {
            dispatch(searchStaffs({ page: tableData.page as number, size: tableData.size as number, name: tableData.title as string }));
        }
        else {
            dispatch(getStaffs({ page: tableData.page as number, size: tableData.size as number}));
        }
    };

    const columns: ColumnDef<Staff>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (props) => <span>{props.row.original.id}</span>,
            },
            {
                header: 'Join Date',
                accessorKey: 'join_at',
                cell: (props) => (
                    <span>{dayjs(props.row.original.joinAt).format('DD/MM/YYYY')}</span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => <span>{props.row.original.email}</span>,
            },
            {
                header: 'Full Name',
                accessorKey: 'full_name',
                cell: (props) => <span className="font-semibold">{props.row.original.fullName}</span>,
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
                cell: (props) => <StaffStatusColumn status={props.row.original.status as string} />,
            },
            {
                header: 'Action',
                accessorKey: 'action',
                id: 'action',
                cell: (props) => {
                    const staff = props.row.original;
                    const isActive = staff.status === 'ACTIVE';

                    const onDeleteClick = () => {
                        dispatch(toggleDeleteConfirmation(true))
                        dispatch(setSelectedStaff(staff))
                    };

                    const onEditClick = () => {
                        onEdit(staff.id as number);
                    };

                    const onBanUnbanClick = () => {
                        dispatch(toggleBanConfirmation(true));
                        dispatch(setSelectedStaff(staff));
                    };

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
        [dispatch, onEdit]
    );

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData);
        newTableData.page = page;
        dispatch(setTableData(newTableData));
    };

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData);
        newTableData.size = Number(value);
        newTableData.page = 1;
        dispatch(setTableData(newTableData));
    };

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
    );
};

export default StaffTable;