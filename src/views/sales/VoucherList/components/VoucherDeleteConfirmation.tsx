import {
    toggleDeleteConfirmation,
    deleteVoucher,
    useAppDispatch,
    useAppSelector,
} from '../store'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'

const VoucherDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    
    const dialogOpen = useAppSelector(
        (state) => state.salesVoucherList.data.deleteConfirmation
    )
    
    const selectedVoucher = useAppSelector(
        (state) => state.salesVoucherList.data.selectedVoucher
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        
        if (selectedVoucher && selectedVoucher.id) {
            dispatch(deleteVoucher(selectedVoucher.id))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Voucher deleted successfully" type="success">
                            Voucher {selectedVoucher.code} has been deleted
                        </Notification>
                    )
                })
                .catch((err) => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            {err?.response?.data?.message || 'Unable to delete voucher'}
                        </Notification>
                    )
                })
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            type="danger"
            title="Delete voucher"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                Are you sure you want to delete this voucher? 
                This action cannot be undone.
            </p>
        </ConfirmDialog>
    )
}

export default VoucherDeleteConfirmation