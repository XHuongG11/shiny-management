import { useEffect, useMemo, useRef } from 'react'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/shared/DataTable'
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { FiPackage } from 'react-icons/fi'
import {
    getProducts,
    setTableData,
    setSelectedProduct,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import ProductDeleteConfirmation from './ProductDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { ProductResponse } from '@/@types/product'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

const inventoryStatusColors = [
    {
        label: 'IN_STOCK',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    {
        label: 'OUT_OF_STOCK',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    {
        label: 'NOT_AVAILABLE',
        dotClass: 'bg-neutral-400',
        textClass: 'text-neutral-400',
    },
]

const ActionColumn = ({ row }: { row: ProductResponse }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`${APP_PREFIX_PATH}/edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProduct(row.id))
    }
    const onViewDetail = () => {
        navigate(`${APP_PREFIX_PATH}/product-detail/${row.id}`)
    }
    return (
        <div className="flex justify-end text-lg">
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onViewDetail}
            >
                <HiOutlineEye />
            </span>
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onEdit}
            >
                <HiOutlinePencil />
            </span>
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={onDelete}
            >
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const ProductColumn = ({ row }: { row: ProductResponse }) => {
    const avatar =
        row !== undefined && row?.images !== undefined && row?.images.at(0) ? (
            <Avatar src={row?.images.at(0)?.url} />
        ) : (
            <Avatar icon={<FiPackage />} />
        )

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{row.title}</span>
        </div>
    )
}

const ProductTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { page, size, sort, title, totalPages } = useAppSelector(
        (state) => state.salesProductList.data.tableData,
    )

    const loading = useAppSelector(
        (state) => state.salesProductList.data.loading,
    )

    const data = useAppSelector(
        (state) => state.salesProductList.data.productList,
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, size, sort])

    const tableData = useMemo(
        () => ({ page, size, sort, title, totalPages }),
        [page, size, sort, title, totalPages],
    )

    const fetchData = () => {
        // dispatch(getProducts({ pageIndex, pageSize, sort, query, filterData }))
        dispatch(getProducts({ page, size, title }))
    }

    const columns: ColumnDef<ProductResponse>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
                },
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.category?.name || 'N/A'}
                        </span>
                    )
                },
            },
            {
                header: 'Material',
                accessorKey: 'material',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.material}</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    const inventoryStatusColor = inventoryStatusColors.find(
                        (i) => i.label === status,
                    )
                    return (
                        <div className="flex items-center gap-2">
                            <Badge className={inventoryStatusColor?.dotClass} />
                            <span
                                className={`capitalize font-semibold ${inventoryStatusColor?.textClass}`}
                            >
                                {inventoryStatusColor?.label}
                            </span>
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
        [],
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

    console.log('data', data)
    return (
        <>
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
                onSort={onSort}
            />
            {data.length === 0 && <h5>Không tìm thấy sản phẩm phù hợp.</h5>}
            <ProductDeleteConfirmation />
        </>
    )
}

export default ProductTable
