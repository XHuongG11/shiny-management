import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    setSelectedOrder,
    deleteOrders,
    getOrders,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { useState } from 'react'

const OrderDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const { deleteConfirmation, selectedOrder, tableData } = useAppSelector(
        (state) => state.salesOrderList.data
    )

    const [isDeleting, setIsDeleting] = useState(false)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
        dispatch(setSelectedOrder(undefined))
    }

    const onDelete = async () => {
        if (!selectedOrder) return

        setIsDeleting(true)
        try {
            const success = await deleteOrders(selectedOrder)
            if (success) {
                dispatch(getOrders(tableData))
                toast.push(
                    <Notification
                        title="Successfully Deleted"
                        type="success"
                        duration={2500}
                    >
                        Order successfully deleted
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                dispatch(toggleDeleteConfirmation(false))
                dispatch(setSelectedOrder(undefined))
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    Failed to delete order
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <ConfirmDialog
            isOpen={deleteConfirmation}
            type="danger"
            title="Delete Order"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonLoading={isDeleting}
        >
            <p>
                Are you sure you want to delete this order? All records related
                to this order will be deleted as well. This action cannot be
                undone.
            </p>
        </ConfirmDialog>
    )
}

export default OrderDeleteConfirmation