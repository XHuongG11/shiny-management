import { useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import {
    getVouchers,
    searchVouchers,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

const VoucherTableSearch = () => {
    const dispatch = useAppDispatch()
    const searchInput = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector(
        (state) => state.salesVoucherList.data.tableData
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
        dispatch(getVouchers({ page: data.page as number, size: data.size as number }))
    }

    const fetchDataWithSearch = (data: TableQueries) => {
        dispatch(setTableData(data))
        dispatch(searchVouchers({ page: data.page as number, size: data.size as number, query: data.title as string }))
    }

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        debounceFn(value)
    }

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Search vouchers"
            prefix={<HiOutlineSearch className="text-lg" />}
            value={searchValue}
            onChange={onSearchChange}
        />
    )
}

export default VoucherTableSearch