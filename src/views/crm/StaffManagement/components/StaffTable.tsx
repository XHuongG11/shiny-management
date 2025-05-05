import React, { useEffect, useMemo, useRef } from 'react';
import DataTable from '@/components/shared/DataTable';
import { HiOutlineTrash, HiOutlinePencil, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import Tooltip from '@/components/ui/Tooltip';
import dayjs from 'dayjs';
import {
    getStaffs,
    setTableData,
    setSelectedStaff,
    toggleDeleteConfirmation,
    setSearchQuery,
    activateStaff,
    banStaff,
    useAppDispatch,
    useAppSelector,
} from '../store';
import cloneDeep from 'lodash/cloneDeep';
import type { DataTableResetHandle, OnSortParam, ColumnDef } from '@/components/shared/DataTable';
import { Staff } from '@/@types/staff';
import StaffTableSearch from './StaffTableSearch';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';

type StaffTableProps = {
    onEdit: () => void;
};

const StaffTable: React.FC<StaffTableProps> = ({ onEdit }) => {
    const tableRef = useRef<DataTableResetHandle>(null);
    const dispatch = useAppDispatch();

    const staffState = useAppSelector((state) => state.staff.data);

    // Kiểm tra an toàn nếu staffState là undefined
    if (!staffState) {
        return (
            <div className="text-red-500 p-4">
                Error: Staff state is not initialized. Please ensure the staff reducer is registered in the Redux store.
            </div>
        );
    }

    const { page = 1, size = 10, sort = null, totalPages = 0, query = '' } = staffState.tableData || {};
    const loading = staffState.loading || false;
    const data = staffState.staffList || [];
    const error = staffState.error || null;

    useEffect(() => {
        fetchData();
    }, [page, size, sort, query]);

    const tableData = useMemo(
        () => ({ page, size, sort, totalPages, query }),
        [page, size, sort, totalPages, query]
    );

    const fetchData = () => {
        dispatch(getStaffs({ page: page ?? 1, size: size ?? 10, query }));
    };

    // const handleSearch = (searchQuery: string) => {
    //     dispatch(setSearchQuery(searchQuery));
    // };

    const columns: ColumnDef<Staff>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (props) => <span>{props.row.original.id ?? 'N/A'}</span>,
            },
            {
                header: 'Join Date',
                accessorKey: 'joinAt',
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
                accessorKey: 'fullName',
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
                    <span>
                        {props.row.original.gender === 'MALE'
                            ? 'Male'
                            : props.row.original.gender === 'FEMALE'
                            ? 'Female'
                            : 'Other'}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status || 'Unknown';
                    return (
                        <span
                            className={`${
                                status === 'ACTIVE'
                                    ? 'text-green-500'
                                    : status === 'BANNED'
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                            }`}
                        >
                            {status}
                        </span>
                    );
                },
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

                    const onToggleStatusClick = async () => {
                        if (!staff.id) {
                            console.error('No staff ID provided');
                            return;
                        }
                        console.log(`Toggling status for ID: ${staff.id} from ${staff.status}`); // Debug log
                        try {
                            if (staff.status === 'ACTIVE') {
                                await dispatch(banStaff(staff.id)).unwrap();
                                toast.push(
                                    <Notification title="Success" type="success">
                                        Staff banned successfully
                                    </Notification>
                                );
                            } else if (staff.status === 'BANNED') {
                                await dispatch(activateStaff(staff.id)).unwrap();
                                toast.push(
                                    <Notification title="Success" type="success">
                                        Staff activated successfully
                                    </Notification>
                                );
                            }
                            dispatch(getStaffs({ page: 1, size: 10, query }));
                        } catch (error: any) {
                            console.error('Toggle status error:', error); // Debug log
                            toast.push(
                                <Notification title="Error" type="danger">
                                    {error.message || 'Failed to update status'}
                                </Notification>
                            );
                        }
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
                            {staff.status !== 'REMOVED' ? (
                                <Tooltip title={staff.status === 'ACTIVE' ? 'Ban' : 'Activate'}>
                                    <button
                                        className={
                                            staff.status === 'ACTIVE'
                                                ? 'text-orange-500 hover:text-orange-700'
                                                : 'text-green-500 hover:text-green-700'
                                        }
                                        onClick={onToggleStatusClick}
                                    >
                                        {staff.status === 'ACTIVE' ? <HiOutlineXCircle /> : <HiOutlineCheckCircle />}
                                    </button>
                                </Tooltip>
                            ) : null}
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

    return (
        <div>
            {/* <StaffTableSearch onSearch={handleSearch} /> */}
            {loading && data.length === 0 ? (
                <div className="p-4">Loading...</div>
            ) : !loading && data.length === 0 ? (
                <div className="p-4">No staff members found.</div>
            ) : (
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={ data }
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
            )}
        </div>
    );
};

export default StaffTable;