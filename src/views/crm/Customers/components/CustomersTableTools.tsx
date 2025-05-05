import { useRef } from 'react'
import Button from '@/components/ui/Button'
import {
    getCustomers,
    setTableData,
    setFilterData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import CustomerTableSearch from './CustomerTableSearch'
import CustomerTableFilter from './CustomerTableFilter'
import cloneDeep from 'lodash/cloneDeep'
import type { TableQueries } from '@/@types/common'

const CustomersTableTools = () => {
    const dispatch = useAppDispatch()

    const inputRef = useRef<HTMLInputElement>(null)

    const tableData = useAppSelector(
        (state) => state.crmCustomers.data.tableData
    )

    const handleInputChange = (val: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.title = val
        newTableData.page = 1
        if (typeof val === 'string' && val.length > 1) {
            dispatch(setTableData(newTableData))
            dispatch(getCustomers(newTableData))
        }

        if (typeof val === 'string' && val.length === 0) {
            dispatch(setTableData(newTableData))
            dispatch(getCustomers(newTableData))
        }
    }

    const onClearAll = () => {
        const newTableData = cloneDeep(tableData)
        newTableData.title = ''
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        dispatch(setFilterData({ status: '' }))
        dispatch(setTableData(newTableData))
        dispatch(getCustomers(newTableData))
    }

    return (
        <div className="md:flex items-center justify-between">
            <div className="md:flex items-center gap-4">
                <CustomerTableSearch
                    ref={inputRef}
                    onInputChange={handleInputChange}
                />
                <CustomerTableFilter />
            </div>
            <div className="mb-4">
                <Button size="sm" onClick={onClearAll}>
                    Clear All
                </Button>
            </div>
        </div>
    )
}

export default CustomersTableTools