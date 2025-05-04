import React, { useState } from 'react';
import { injectReducer } from '@/store';
import reducer from './store';
import AdaptableCard from '@/components/shared/AdaptableCard';
import StaffTable from './components/StaffTable';
import StaffTableTools from './components/StaffTableTools';
import StaffForm from './components/StaffForm';
import StaffDeleteConfirmation from './components/StaffDeleteConfirmation';
import { useAppSelector } from './store';

injectReducer('staff', reducer);

const StaffManagement: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const selectedStaff = useAppSelector((state) => state.staff.data.selectedStaff);

    const handleAddStaff = () => {
        setEditMode(false);
        setIsFormOpen(true);
    };

    const handleEditStaff = () => {
        if (selectedStaff) {
            setEditMode(true);
            setIsFormOpen(true);
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Staff</h3>
                <StaffTableTools onAddStaff={handleAddStaff} />
            </div>
            <StaffTable onEdit={handleEditStaff} />
            <StaffForm open={isFormOpen} onClose={handleCloseForm} editMode={editMode} />
            <StaffDeleteConfirmation />
        </AdaptableCard>
    );
};

export default StaffManagement;