import React from 'react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleDeleteConfirmation, deleteStaff, getStaffs } from '../store/staffSlice';
import { Staff } from '@/@types/staff';

const StaffDeleteConfirmation = () => {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.staff.data.deleteConfirmationVisible);
    const selectedStaff = useAppSelector((state) => state.staff.data.selectedStaff);
    const loading = useAppSelector((state) => state.staff.data.loading);

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false));
    };

    const onDelete = async () => {
        if (!selectedStaff?.id) return;

        try {
            await dispatch(deleteStaff(selectedStaff.id)).unwrap();
            toast.push(
                <Notification title="Success" type="success">
                    Staff deleted successfully
                </Notification>
            );
            // Refresh staff list
            dispatch(getStaffs({ page: 1, size: 10 }));
            onDialogClose();
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error.message || 'Failed to delete staff'}
                </Notification>
            );
        }
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onDialogClose}
            width={400}
            contentClassName="pb-6"
        >
            <h5 className="mb-4">Delete Staff</h5>
            <p>
                Are you sure you want to delete{' '}
                <strong>{selectedStaff?.fullName || 'this staff'}</strong> (
                {selectedStaff?.email || 'unknown email'})?
            </p>
            <p className="text-red-500 mt-2">This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-2">
                <Button
                    variant="plain"
                    onClick={onDialogClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="solid"
                    color="red-600"
                    onClick={onDelete}
                    loading={loading}
                >
                    Delete
                </Button>
            </div>
        </Dialog>
    );
};

export default StaffDeleteConfirmation;