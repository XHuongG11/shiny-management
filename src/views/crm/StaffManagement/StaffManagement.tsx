// StaffManagement.tsx
import React, { useState, useEffect } from 'react';
import { injectReducer } from '@/store';
import reducer from './store';
import AdaptableCard from '@/components/shared/AdaptableCard';
import StaffTable from './components/StaffTable';
import StaffTableTools from './components/StaffTableTools';
import StaffForm from './components/StaffForm';
import StaffDeleteConfirmation from './components/StaffDeleteConfirmation';
import { useAppDispatch, useAppSelector } from './store';
import { getStaffs, setSearchQuery } from './store'; // Import thêm các action

// Inject reducer vào store
injectReducer('staff', reducer);

const StaffManagement: React.FC = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQueryState] = useState<string>(''); // Trạng thái tìm kiếm

    const selectedStaff = useAppSelector((state) => state.staff.data.selectedStaff);
    const dispatch = useAppDispatch();
    
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

    // Hàm xử lý tìm kiếm
    const handleSearch = (query: string) => {
        setSearchQueryState(query);  // Cập nhật truy vấn tìm kiếm
        dispatch(setSearchQuery(query)); // Cập nhật truy vấn tìm kiếm trong store
    };

    // Gọi API để lấy danh sách nhân viên khi `searchQuery` thay đổi
    useEffect(() => {
        dispatch(getStaffs({ page: 1, size: 10, query: searchQuery }));
    }, [dispatch, searchQuery]);

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Staff</h3>
                <StaffTableTools onAddStaff={handleAddStaff} onSearch={handleSearch} />
            </div>
            <StaffTable onEdit={handleEditStaff} />
            <StaffForm open={isFormOpen} onClose={handleCloseForm} editMode={editMode} />
            <StaffDeleteConfirmation />
        </AdaptableCard>
    );
};

export default StaffManagement;
