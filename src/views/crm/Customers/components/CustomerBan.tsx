import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { 
    deactivateCustomer,
    toggleBanConfirmation, 
    activateCustomer, 
    useAppDispatch, 
    useAppSelector 
} from '../store';
import { ConfirmDialog } from '@/components/shared';

const CustomerBan = () => {
    const dispatch = useAppDispatch()

    const dialogOpen = useAppSelector(
        (state) => state.crmCustomers.data.banConfirmation
    )
    
    const selectedCustomer = useAppSelector(
        (state) => state.crmCustomers.data.selectedCustomer
    )

    const isBanned = selectedCustomer?.status === 'BANNED'

    const onDialogClose = () => {
        dispatch(toggleBanConfirmation(false))
    }

    const Ban = async () => {
        dispatch(toggleBanConfirmation(false))
        
        if (selectedCustomer && selectedCustomer.id) {
            dispatch(deactivateCustomer(selectedCustomer.id))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Customer {selectedCustomer.fullName} has been banned
                        </Notification>
                    )
                })
                .catch((err) => {
                    let errorMessage = 'Unable to ban customer';
                    if (err.response && err.response.data) {
                        errorMessage = err.response.data.message || errorMessage
                    } else if (err.message) {
                        errorMessage = err.message
                    }
                    toast.push(
                        <Notification title="Error" type="danger">
                            {errorMessage}
                        </Notification>
                    )
                })
        }
    }

    const unBan = async () => {
        dispatch(toggleBanConfirmation(false))
        
        if (selectedCustomer && selectedCustomer.id) {
            dispatch(activateCustomer(selectedCustomer.id))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Customer {selectedCustomer.fullName} has been unbanned
                        </Notification>
                    )
                })
                .catch((err) => {
                    let errorMessage = 'Unable to unban customer';
                    if (err.response && err.response.data) {
                        errorMessage = err.response.data.message || errorMessage
                    } else if (err.message) {
                        errorMessage = err.message
                    }
                    toast.push(
                        <Notification title="Error" type="danger">
                            {errorMessage}
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
            title={isBanned ? 'Unban Customer' : 'Ban Customer'}
            onCancel={onDialogClose}
            onConfirm={ isBanned ? unBan : Ban}
            confirmButtonColor="red-600"
        >
            <p>
                Are you sure you want to {isBanned ? 'unban' : 'ban'} this customer?
                <br />
                This action cannot be undone.
            </p>
        </ConfirmDialog>
    )
};

export default CustomerBan;