import React, { useEffect, useMemo, useRef } from 'react';
import DataTable from '@/components/shared/DataTable';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import Tooltip from '@/components/ui/Tooltip';
import dayjs from 'dayjs';
import {
    getStaffs,
    setTableData,
    setSelectedStaff,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store';
import cloneDeep from 'lodash/cloneDeep';
import type { DataTableResetHandle, OnSortParam, ColumnDef } from '@/components/shared/DataTable';

type Staff = {
    id: number;
    join_at: string;
    email: string;
    fullName: string;
    phone: string;
    username: string;
    gender: string;
    status: string;
};

type StaffTableProps = {
    onEdit: () => void;
};

const StaffTable: React.FC<StaffTableProps> = ({ onEdit }) => {
    const tableRef = useRef<DataTableResetHandle>(null);
    const dispatch = useAppDispatch();

    const staffState = useAppSelector((state) => state.staff);

    const { page = 1, size = 10, sort = null, totalPages = 0 } = staffState.data.tableData || {};
    const loading = staffState.data.loading || false;
    const data = staffState.data.staffList || [];
    const error = staffState.data.error || null;

    useEffect(() => {
        fetchData();
    }, [page, size, sort]);

    const tableData = useMemo(
        () => ({ page, size, sort, totalPages }),
        [page, size, sort, totalPages]
    );

    const fetchData = () => {
        dispatch(getStaffs({ page: page ?? 1, size: size ?? 10 }));
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
                    <span>{dayjs(props.row.original.join_at).format('DD/MM/YYYY')}</span>
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
                cell: (props) => <span>{props.row.original.fullName}</span>,
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
                    <span>{props.row.original.gender === 'M' ? 'Male' : 'Female'}</span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => (
                    <span
                        className={`${
                            props.row.original.status === 'active'
                                ? 'text-green-500'
                                : 'text-red-500'
                        }`}
                    >
                        {props.row.original.status}
                    </span>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: (props) => {
                    const staff = props.row.original;

                    const onDeleteClick = () => {
                        dispatch(toggleDeleteConfirmation(true));
                        dispatch(setSelectedStaff(staff));
                    };

                    const onEditClick = () => {
                        dispatch(setSelectedStaff(staff));
                        setTimeout(() => {
                            onEdit();
                        }, 0);
                    };

                    return (
                        <div className="flex justify-end space-x-2">
                            <Tooltip title="Edit">
                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={onEditClick}
                                >
                                    <HiOutlinePencil />
                                </button>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={onDeleteClick}
                                >
                                    <HiOutlineTrash />
                                </button>
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

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData);
        newTableData.sort = sort;
        dispatch(setTableData(newTableData));
    };

    if (error) {
        return (
            <div className="text-red-500 p-4">
                Error: {error}
                <button
                    className="ml-4 text-blue-500 hover:text-blue-700"
                    onClick={fetchData}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!loading && data.length === 0) {
        return <div className="p-4">No staff members found.</div>;
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
                total: tableData.totalPages * tableData.size,
                pageIndex: tableData.page as number,
                pageSize: tableData.size as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
        />
    );
};

export default StaffTable;