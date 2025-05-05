import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useAppDispatch, useAppSelector } from '../store'
import {
    toggleDeleteConfirmation as toggleCollectionDeleteConfirmation,
    deleteCollection,
} from '../store/collectionsSlice'
import {
    deleteCategory,
    toggleDeleteConfirmation as toggleCategoryDeleteConfirmation,
} from '../store/categoriesSlice'

const CatalogDeleteConfirmation = () => {
    const dispatch = useAppDispatch()

    const type = useAppSelector((state) => state.salesCatalog.catalog.type)

    const collectionDialogOpen = useAppSelector(
        (state) => state.salesCatalog?.collections?.deleteConfirmation,
    )
    const categoryDialogOpen = useAppSelector(
        (state) => state.salesCatalog?.categories?.deleteConfirmation,
    )
    const dialogOpen =
        type === 'Collection' ? collectionDialogOpen : categoryDialogOpen

    const selectedCategory = useAppSelector(
        (state) => state.salesCatalog?.categories?.selectedCategory,
    )
    const selectedCollection = useAppSelector(
        (state) => state.salesCatalog?.collections?.selectedCollection,
    )
    const selectedCatalog =
        type === 'Category' ? selectedCategory : selectedCollection

    const onDialogClose = () => {
        type === 'Collection'
            ? dispatch(toggleCollectionDeleteConfirmation(false))
            : dispatch(toggleCategoryDeleteConfirmation(false))
    }

    const onDelete = async () => {
        type === 'Collection'
            ? dispatch(toggleCollectionDeleteConfirmation(false))
            : dispatch(toggleCategoryDeleteConfirmation(false))
        if (selectedCatalog !== undefined) {
            if (type === 'Collection') {
                const resultAction = await dispatch(
                    deleteCollection(selectedCatalog),
                )
                if (deleteCollection.fulfilled.match(resultAction)) {
                    toast.push(
                        <Notification
                            title={'Successfuly Deleted'}
                            type="success"
                            duration={2500}
                        >
                            Successfuly deleted
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                } else {
                    toast.push(
                        <Notification
                            title={'Fail Deleted'}
                            type="success"
                            duration={2500}
                        >
                            {String(resultAction.payload)}
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                }
            } else {
                const resultAction = await dispatch(
                    deleteCategory(selectedCatalog),
                )
                if (deleteCategory.fulfilled.match(resultAction)) {
                    toast.push(
                        <Notification
                            title={'Successfuly Deleted'}
                            type="success"
                            duration={2500}
                        >
                            Successfuly deleted
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                } else {
                    toast.push(
                        <Notification
                            title={'Fail Deleted'}
                            type="success"
                            duration={2500}
                        >
                            {String(resultAction.payload)}
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                }
            }
        } else {
            toast.push(
                <Notification
                    title={`Fail Deleted`}
                    type="danger"
                    duration={2500}
                >
                    Failed to delete
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="danger"
            title={`Delete ${type}`}
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Bạn có chắc chắn muốn xóa danh mục này không?</p>
        </ConfirmDialog>
    )
}

export default CatalogDeleteConfirmation
