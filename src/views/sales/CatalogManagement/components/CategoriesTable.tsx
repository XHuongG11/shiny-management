import { Category } from '@/@types/product'
import type {
    ColumnDef,
    DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useEffect, useMemo, useRef, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import {
    getCategories,
    setSelectedCategory,
    updateCategory,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { toggleDeleteConfirmation } from '../store/categoriesSlice'
import CatalogDeleteConfirmation from './CatalogDeleteConfirmation'
import CategoryModal from './CategoryModal'

const ActionColumn = ({
    row,
    onEdit,
}: {
    row: Category
    onEdit: () => void
}) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedCategory(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
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

const CategoryTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [type, setType] = useState<'edit' | 'new'>('new')
    const [editingData, setEditingData] = useState<{
        id: number
        name: string
        parent?: Category
    }>({
        id: 0,
        name: '',
        parent: undefined,
    })

    const handleEdit = (row: Category) => {
        setEditingData({
            id: row.id ?? 0,
            name: row.name ?? '',
            parent: row.parent ?? undefined,
        })
        setType('edit')
        setIsModalOpen(true)
    }

    const handleSubmit = async (values: {
        id?: number
        name: string
        parent?: Category | null
    }) => {
        try {
            const resp = await dispatch(
                updateCategory({
                    id: values.id ?? 0,
                    name: values.name,
                    parent: values.parent,
                }),
            )
            if (resp.meta.requestStatus === 'fulfilled') {
                toast.push(
                    <Notification
                        title={'Successfully updated'}
                        type="success"
                        duration={2500}
                    >
                        Category updated successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            }
        } catch (error) {
            toast.push(
                <Notification
                    title={'Error updating category'}
                    type="danger"
                    duration={2500}
                >
                    Failed to update category
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const loading = useAppSelector(
        (state) => state.salesCatalog?.categories.data?.loading ?? false,
    )

    const data = useAppSelector(
        (state) => state.salesCatalog?.categories?.data?.categories ?? [],
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getCategories())
        console.log('data', data)
    }

    const columns: ColumnDef<Category>[] = useMemo(
        () => [
            {
                header: 'ID',
                accessorKey: 'id',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row?.id}</span>
                },
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row?.name}</span>
                },
            },
            {
                header: 'Parent',
                accessorKey: 'parent',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row?.parent?.name || 'N/A'}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        row={props.row.original}
                        onEdit={() => handleEdit(props.row.original)}
                    />
                ),
            },
        ],
        [],
    )
    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data || []}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                pagingData={{
                    total: 1,
                    pageIndex: 1,
                    pageSize: data.length,
                }}
                loading={loading}
                isPage={false}
            />
            <CatalogDeleteConfirmation />
            <CategoryModal
                isOpen={isModalOpen}
                type={type}
                initialData={editingData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default CategoryTable
