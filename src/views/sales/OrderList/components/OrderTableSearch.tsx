import { useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import {
    getOrders,
    setTableData,
    setSearchQuery,
    useAppDispatch,
    useAppSelector,
} from '../store'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

const OrderTableSearch = () => {
    const dispatch = useAppDispatch()

    const searchInput = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector(
        (state) => state.salesOrderList.data.tableData
    )

    const [searchValue, setSearchValue] = useState(tableData.query || '')

    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.query = val
        newTableData.page = 1
        // Fetch data with the updated search query
        fetchData(newTableData)
    }

    const fetchData = (data: TableQueries & { status?: string, query?: string }) => {
        dispatch(setTableData(data))
        //dispatch(getOrders(data))
    }

    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        debounceFn(value)
    }

    return (
        <Input
            ref={searchInput}
            className="lg:w-52"
            size="sm"
            placeholder="Search"
            prefix={<HiOutlineSearch className="text-lg" />}
            onChange={onSearchChange}
            value={searchValue}
        />
    )
}

export default OrderTableSearch
