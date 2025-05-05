import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { 
    banStaff,
    toggleBanConfirmation, 
    unbanStaff, 
    useAppDispatch, 
    useAppSelector 
} from '../store';
import { ConfirmDialog } from '@/components/shared';

const StaffBan = () => {
    const dispatch = useAppDispatch()

    const dialogOpen = useAppSelector(
        (state) => state.staffManagement.data.banConfirmation
    )
    
    const selectedStaff = useAppSelector(
        (state) => state.staffManagement.data.selectedStaff
    )

    const isBanned = selectedStaff?.status === 'BANNED'

    const onDialogClose = () => {
        dispatch(toggleBanConfirmation(false))
    }

    const Ban = async () => {
        dispatch(toggleBanConfirmation(false))
        
        if (selectedStaff && selectedStaff.id) {
            dispatch(banStaff(selectedStaff.id))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Staff {selectedStaff.fullName} has been banned
                        </Notification>
                    )
                })
                .catch((err) => {
                    let errorMessage = 'Unable to ban staff';
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
        
        if (selectedStaff && selectedStaff.id) {
            dispatch(unbanStaff(selectedStaff.id))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Staff {selectedStaff.fullName} has been unbanned
                        </Notification>
                    )
                })
                .catch((err) => {
                    let errorMessage = 'Unable to unban staff';
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
            title={isBanned ? 'Unban Staff' : 'Ban Staff'}
            onCancel={onDialogClose}
            onConfirm={ isBanned ? unBan : Ban}
            confirmButtonColor="red-600"
        >
            <p>
                Are you sure you want to {isBanned ? 'unban' : 'ban'} this staff?
                <br />
                This action cannot be undone.
            </p>
        </ConfirmDialog>
    )
};

export default StaffBan;