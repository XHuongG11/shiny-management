import { useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import {
    getProducts,
    setTableData,
    useAppSelector,
    useAppDispatch,
} from '../store'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'
import type { ChangeEvent } from 'react'

const ProductTableSearch = () => {
    const dispatch = useAppDispatch()
    const searchInput = useRef(null)

    const tableData = useAppSelector(
        (state) => state.salesProductList.data.tableData,
    )
    const [searchValue, setSearchValue] = useState(tableData.title || '')
    const debounceFn = debounce(handleDebounceFn, 500)

    function handleDebounceFn(val: string) {
        const newTableData = cloneDeep(tableData)
        newTableData.title = val
        newTableData.page = 1
        if (typeof val === 'string' && val.length > 1) {
            fetchData(newTableData)
        }

        if (typeof val === 'string' && val.length === 0) {
            fetchData(newTableData)
        }
    }

    const fetchData = (data: TableQueries) => {
        dispatch(setTableData(data))
        dispatch(getProducts(data))
    }

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchValue(value)
        debounceFn(e.target.value)
    }

    return (
        <Input
            ref={searchInput}
            className="max-w-md md:w-52 md:mb-0 mb-4"
            size="sm"
            placeholder="Search product"
            prefix={<HiOutlineSearch className="text-lg" />}
            value={searchValue}
            onChange={onEdit}
        />
    )
}

export default ProductTableSearch
