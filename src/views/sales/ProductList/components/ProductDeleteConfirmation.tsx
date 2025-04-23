import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteProduct,
    getProducts,
    useAppDispatch,
    useAppSelector,
} from '../store'

const ProductDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.salesProductList.data.deleteConfirmation,
    )
    const selectedProduct = useAppSelector(
        (state) => state.salesProductList.data.selectedProduct,
    )
    const tableData = useAppSelector(
        (state) => state.salesProductList.data.tableData,
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        if (selectedProduct !== undefined) {
            const success = await deleteProduct(selectedProduct)
            dispatch(getProducts(tableData))
            if (success) {
                toast.push(
                    <Notification
                        title={'Successfuly Deleted'}
                        type="success"
                        duration={2500}
                    >
                        Product successfuly deleted
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            }
        } else {
            toast.push(
                <Notification
                    title={`Fail Deleted`}
                    type="danger"
                    duration={2500}
                >
                    Failed to delete product
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
            title="Delete product"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Bạn có chắc chắn muốn xóa món sản phẩm này không?</p>
        </ConfirmDialog>
    )
}

export default ProductDeleteConfirmation
