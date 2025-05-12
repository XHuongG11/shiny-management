import { useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import debounce from 'lodash/debounce'
import { getCustomers, searchCustomers, setTableData, useAppDispatch, useAppSelector } from '../store'
import { cloneDeep } from 'lodash'
import { TableQueries } from '@/@types/common'


const CustomerTableSearch = () => {
    const dispatch = useAppDispatch()
    const searchInput = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector(
        (state) => state.crmCustomers.data.tableData
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
        dispatch(getCustomers({ page: data.page as number, size: data.size as number }))
    }

    const fetchDataWithSearch = (data: TableQueries) => {
        dispatch(setTableData(data))
        dispatch(searchCustomers({ page: data.page as number, size: data.size as number, name: data.title as string }))
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
            placeholder="Search customer"
            prefix={<HiOutlineSearch className="text-lg" />}
            value={searchValue}
            onChange={handleSearchChange}
        />
    )
};

export default CustomerTableSearch