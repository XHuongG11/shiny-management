import React, { useState, useCallback } from 'react';
import Input from '@/components/ui/Input';
import { HiOutlineSearch } from 'react-icons/hi';
import debounce from 'lodash/debounce';

type StaffTableSearchProps = {
    onSearch: (query: string) => void;
};

const StaffTableSearch = ({ onSearch }: StaffTableSearchProps) => {
    const [query, setQuery] = useState('');

    // Đặt hàm debounce cho onSearch để giảm số lần gọi hàm
    const debouncedSearch = useCallback(
        debounce((nextValue: string) => onSearch(nextValue), 500), // 500ms debounce
        []
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery); // Gọi hàm debounce
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
