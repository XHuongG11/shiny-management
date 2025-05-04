import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { HiOutlineSearch } from 'react-icons/hi';

type StaffTableSearchProps = {
    onSearch: (query: string) => void;
};

const StaffTableSearch = ({ onSearch }: StaffTableSearchProps) => {
    const [query, setQuery] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        onSearch(e.target.value); // Gọi hàm `onSearch` khi giá trị thay đổi
    };

    return (
        <Input
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Search staff"
            prefix={<HiOutlineSearch className="text-lg" />}
            value={query}
            onChange={handleSearchChange}
        />
    );
};

export default StaffTableSearch;