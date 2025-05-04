import React, { useState } from 'react';
import { injectReducer } from '@/store';
import reducer from './store';
import AdaptableCard from '@/components/shared/AdaptableCard';
import StaffTable from './components/StaffTable';
import StaffTableTools from './components/StaffTableTools';
import StaffForm from './components/StaffForm';
import { useAppSelector } from './store';

injectReducer('staff', reducer);

const StaffManagement: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const selectedStaff = useAppSelector((state) => state.staff.selectedStaff);

    const handleAddStaff = () => {
        setEditMode(false); // Chế độ thêm mới
        setIsFormOpen(true); // Mở form
    };

    const handleEditStaff = () => {
        if (selectedStaff) {
            setEditMode(true); // Chế độ chỉnh sửa
            setIsFormOpen(true); // Mở form
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false); // Đóng form
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Staff</h3>
                <StaffTableTools onAddStaff={handleAddStaff} />
            </div>
            <StaffTable onEdit={handleEditStaff} />
            <StaffForm open={isFormOpen} onClose={handleCloseForm} editMode={editMode} />
        </AdaptableCard>
    );
};

export default StaffManagement;