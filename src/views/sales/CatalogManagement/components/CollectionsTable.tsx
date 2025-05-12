import { Collection } from '@/@types/product'
import type {
    ColumnDef,
    DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useEffect, useMemo, useRef, useState } from 'react'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useAppDispatch, useAppSelector } from '../store'
import {
    getCollections,
    setSelectedCollection,
    toggleDeleteConfirmation,
    updateCollection,
} from '../store/collectionsSlice'
import CatalogDeleteConfirmation from './CatalogDeleteConfirmation'
import CollectionModal from './CollectionModal'

const ActionColumn = ({
    row,
    onEdit,
}: {
    row: Collection
    onEdit: () => void
}) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()

    const onDelete = () => {
        console.log('deleted')
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedCollection(row.id))
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

const CollectionsTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const loading = useAppSelector(
        (state) => state.salesCatalog?.collections.data?.loading ?? false,
    )

    const data = useAppSelector(
        (state) => state.salesCatalog?.collections?.data?.collections ?? [],
    )

    const [type, setType] = useState<'edit' | 'new'>('new')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingData, setEditingData] = useState({
        id: 0,
        name: '',
        description: '',
    })
    const handleEdit = (row: Collection) => {
        setEditingData({
            id: row.id ?? 0,
            name: row.name ?? '',
            description: row.description ?? '',
        })
        setType('edit')
        setIsModalOpen(true)
    }

    const handleSubmit = async (values: {
        id?: number
        name: string
        description: string
    }) => {
        console.log('Submitting edited collection:', values)
        try {
            const resp = await dispatch(
                updateCollection({
                    id: values.id ?? 0,
                    name: values.name,
                    description: values.description.replace(/<\/?p>/g, ''),
                }),
            )
            if (resp.meta.requestStatus === 'fulfilled') {
                toast.push(
                    <Notification
                        title={'Successfuly added'}
                        type="success"
                        duration={2500}
                    >
                        Update collection successfuly
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            }
        } catch (error) {
            toast.push(
                <Notification
                    title={'Lỗi cập nhật collection'}
                    type="success"
                    duration={2500}
                >
                    Update collection successfuly
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getCollections())
        console.log('data', data)
    }

    const columns: ColumnDef<Collection>[] = useMemo(
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
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row?.description || 'N/A'}
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
            <CollectionModal
                isOpen={isModalOpen}
                type={type}
                initialData={editingData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default CollectionsTable
