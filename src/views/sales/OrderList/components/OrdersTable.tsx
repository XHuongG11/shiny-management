import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { NumericFormat } from 'react-number-format';
import { HiOutlineEye } from 'react-icons/hi';
import Tooltip from '@/components/ui/Tooltip';
import Badge from '@/components/ui/Badge';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
    getOrders,
    setTableData,
    setStatusFilter,
    useAppDispatch,
    useAppSelector,
} from '../store';
import useThemeClass from '@/utils/hooks/useThemeClass';
import { useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';
import dayjs from 'dayjs';
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

type Order = {
    id: string;
    orderDate: string;
    shippingAddress: { recipientName: string };
    paymentMethod: string;
    status: string;
    totalPrice: number;
};

const PaymentMethodImage = ({
    paymentMethod,
    className,
}: {
    paymentMethod: string;
    className: string;
}) => {
    switch (paymentMethod.toLowerCase()) {
        case 'vn-pay':
            return <span className={className}>VN-PAY</span>;
        case 'cod':
            return <span className={className}>COD</span>;
        default:
            return <span className={className}>{paymentMethod}</span>;
    }
};

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
};

const ActionColumn = ({ row }: { row: Order }) => {
    const { textTheme } = useThemeClass();
    const navigate = useNavigate();

    const onView = useCallback(() => {
        navigate(`${APP_PREFIX_PATH}/order-details/${row.id}`);
    }, [navigate, row]);

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
    );
};

const OrdersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { page, size, sort, totalPages, status, query } = useAppSelector(
        (state) => state.salesOrderList.data.tableData
    );
    const loading = useAppSelector((state) => state.salesOrderList.data.loading);
    const data = useAppSelector((state) => state.salesOrderList.data.orderList);

    const [currentTab, setCurrentTab] = useState('ALL');

    const tabs = [
        { key: 'ALL', label: 'All' },
        { key: 'PENDING', label: 'Pending' },
        { key: 'CONFIRMED', label: 'Confirmed' },
        { key: 'SHIPPING', label: 'Shipping' },
        { key: 'COMPLETED', label: 'Completed' },
        { key: 'DELIVERED', label: 'Delivered' },
        { key: 'CANCELLED', label: 'Cancelled' },
        { key: 'RETURNED', label: 'Returned' },
        { key: 'RETURN_REQUESTED', label: 'Return Requested' },
        { key: 'RETURN_REJECTED', label: 'Return Rejected' },
    ];

    // Handle tab change
    const handleTabChange = (newTab: string) => {
        setCurrentTab(newTab);
        const newTableData = cloneDeep(tableData);
        newTableData.status = newTab === 'ALL' ? undefined : newTab;
        dispatch(setStatusFilter(newTab));
        newTableData.page = 1;
        dispatch(setTableData(newTableData));
    };

    const fetchData = () => {
        dispatch(getOrders({ page, size, status , query }));
    };

    useEffect(() => {
        fetchData()
    }, [page, size, sort, status, query]);

    const tableData = useMemo(
        () => ({ page, size, sort, totalPages, status, query}),
        [page, size, sort, totalPages, status, query]
    );

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                header: 'Order',
                accessorKey: 'id',
                cell: (props) => {
                    const { id } = props.row.original;
                    return (
                        <span
                            className="cursor-pointer select-none font-semibold hover:text-blue-600"
                            onClick={() =>
                                navigate(`${APP_PREFIX_PATH}/order-details/${id}`)
                            }
                        >
                            #{id}
                        </span>
                    );
                },
            },
            {
                header: 'Date',
                accessorKey: 'orderDate',
                cell: (props) => {
                    const { orderDate } = props.row.original;
                    return (
                        <span>
                            {dayjs(orderDate).format('DD/MM/YYYY HH:mm')}
                        </span>
                    );
                },
            },
            {
                header: 'Customer',
                accessorKey: 'shippingAddress.recipientName',
                cell: (props) => {
                    const { shippingAddress } = props.row.original;
                    return <span>{shippingAddress.recipientName}</span>;
                },
            },
            {
                header: 'Payment Method',
                accessorKey: 'paymentMethod',
                cell: (props) => {
                    const { paymentMethod } = props.row.original;
                    return (
                        <span className="flex items-center">
                            <PaymentMethodImage
                                className="max-h-[20px]"
                                paymentMethod={paymentMethod}
                            />
                        </span>
                    );
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original;
                    const statusKey = status in statusDisplayMap ? status : 'UNKNOWN';
                    return (
                        <div className="flex items-center">
                            <Badge
                                className={statusDisplayMap[statusKey].dotClass}
                            />
                            <span
                                className={`ml-2 rtl:mr-2 capitalize font-semibold ${statusDisplayMap[statusKey].textClass}`}
                            >
                                {statusDisplayMap[statusKey].label}
                            </span>
                        </div>
                    );
                },
            },
            {
                header: 'Total',
                accessorKey: 'totalPrice',
                cell: (props) => {
                    const { totalPrice } = props.row.original;
                    return (
                        <NumericFormat
                            displayType="text"
                            value={(Math.round(totalPrice * 100) / 100).toFixed(2)}
                            suffix={' VNĐ'}
                            thousandSeparator={true}
                        />
                    );
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        [navigate]
    );

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData);
        newTableData.page = page;
        dispatch(setTableData(newTableData));
        //dispatch(getOrders(newTableData));
    };

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData);
        newTableData.size = Number(value);
        newTableData.page = 1;
        dispatch(setTableData(newTableData));
        //dispatch(getOrders(newTableData));
    };

    return (
        <div>
            <Tabs
                value={currentTab}
                onChange={(event, newValue) => handleTabChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '4px 8px',
                    marginBottom: '16px',
                    '& .MuiTabs-flexContainer': {
                        justifyContent: 'flex-start',
                        gap: '8px',
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: '8px 16px',
                        color: '#4b5563',
                        minHeight: 'auto',
                        minWidth: '100px',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#f3f4f6',
                            borderRadius: '6px',
                        },
                    },
                    '& .Mui-selected': {
                        color: '#1e40af',
                        fontWeight: 600,
                        backgroundColor: '#e0e7ff',
                        borderRadius: '6px',
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#1e40af',
                        height: '3px',
                        borderRadius: '2px',
                        width: '100%',
                    },
                }}
            >
                {tabs.map((tab) => (
                    <Tab key={tab.key} label={tab.label} value={tab.key} />
                ))}
            </Tabs>

            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                loading={loading}
                pagingData={{
                    total: tableData.totalPages as number,
                    pageIndex: tableData.page as number,
                    pageSize: tableData.size as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
            />
        </div>
    );
};

export default OrdersTable;