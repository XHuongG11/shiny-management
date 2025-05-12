import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { 
    deleteStaff, 
    toggleDeleteConfirmation, 
    useAppDispatch, 
    useAppSelector 
} from '../store';
import { ConfirmDialog } from '@/components/shared';

const StaffDelete = () => {
    const dispatch = useAppDispatch()

    const dialogOpen = useAppSelector(
        (state) => state.staffManagement.data.deleteConfirmation
    )
    
    const selectedStaff = useAppSelector(
        (state) => state.staffManagement.data.selectedStaff
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        
        if (selectedStaff && selectedStaff.id) {
            dispatch(deleteStaff(selectedStaff.id))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Staff {selectedStaff.fullName} has been deleted
                        </Notification>
                    )
                })
                .catch((err) => {
                    let errorMessage = 'Unable to delete staff';
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
            title="Delete staff"
            onCancel={onDialogClose}
            onConfirm={onDelete}
            confirmButtonColor="red-600"
        >
            <p>
                Are you sure you want to delete this staff? 
                <br />
                This action cannot be undone.
            </p>
        </ConfirmDialog>
    )
};

export default StaffDelete;