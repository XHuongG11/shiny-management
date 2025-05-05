// StaffTableTools.tsx
import React from 'react';
import Button from '@/components/ui/Button';
import { HiPlusCircle } from 'react-icons/hi';
import StaffTableSearch from './StaffTableSearch';

type StaffTableToolsProps = {
    onAddStaff: () => void;
    onSearch: (query: string) => void; // Nhận prop `onSearch`
};

const StaffTableTools = ({ onAddStaff, onSearch }: StaffTableToolsProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4">
            <StaffTableSearch onSearch={onSearch} />
            <Button
                size="sm"
                variant="solid"
                onClick={onAddStaff}
                icon={<HiPlusCircle />}
            >
                Add Staff
            </Button>
        </div>
    );
};

export default StaffTableTools;
