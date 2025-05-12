import React, { useRef, useState } from 'react';
import Input from '@/components/ui/Input';
import { HiOutlineSearch } from 'react-icons/hi';
import { getStaffs, searchStaffs, setTableData, useAppDispatch, useAppSelector } from '../store';
import { cloneDeep, debounce } from 'lodash';
import { TableQueries } from '@/@types/common';

const StaffTableSearch = () => {
    const dispatch = useAppDispatch()
    const searchInput = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector(
        (state) => state.staffManagement.data.tableData
    )

    const [searchValue, setSearchValue] = useState(tableData.title || '')

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.title = val
        newTableData.page = 1
        if (typeof val === 'string' && val.length >= 1) {
            fetchDataWithSearch(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData(newTableData)
        }
    }

    const fetchData = (data: TableQueries) => {
        dispatch(setTableData(data))
        dispatch(getStaffs({ page: data.page as number, size: data.size as number }))
    }

    const fetchDataWithSearch = (data: TableQueries) => {
        dispatch(setTableData(data))
        dispatch(searchStaffs({ page: data.page as number, size: data.size as number, name: data.title as string }))
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        debounceFn(value);
    };

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Search staff"
            prefix={<HiOutlineSearch className="text-lg" />}
            value={searchValue}
            onChange={handleSearchChange}
        />
    );
};

export default StaffTableSearch;