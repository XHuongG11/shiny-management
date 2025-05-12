import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Button from '@/components/ui/Button'
import { getSalesDashboardData, setMonth, setYear } from '../store'
import { useAppDispatch } from '@/store'
import { HiOutlineFilter } from 'react-icons/hi'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

const SalesDashboardHeader = () => {
    const dispatch = useAppDispatch()
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())

    const onFilter = () => {
        if (!selectedDate) return
        const month = selectedDate.month() + 1
        const year = selectedDate.year()
        dispatch(getSalesDashboardData({ month, year }))
        dispatch(setMonth(month))
        dispatch(setYear(year))
    }
    useEffect(() => {
        const month = selectedDate.month() + 1
        const year = selectedDate.year()
        dispatch(setMonth(month))
        dispatch(setYear(year))
        dispatch(getSalesDashboardData({ month, year }))
    }, [])
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="lg:flex items-center justify-between mb-4 gap-3">
                <div className="mb-4 lg:mb-0">
                    <h3>Sales Overview</h3>
                    <p>View your current sales & summary</p>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                    <DatePicker
                        label="Select month"
                        views={['year', 'month']}
                        value={selectedDate}
                        onChange={(newValue: Dayjs | null) =>
                            setSelectedDate(newValue || dayjs())
                        }
                        slotProps={{ textField: { fullWidth: true } }}
                        format="MM/YYYY"
                    />
                    <Button
                        size="sm"
                        icon={<HiOutlineFilter />}
                        onClick={onFilter}
                    >
                        Filter
                    </Button>
                </div>
            </div>
        </LocalizationProvider>
    )
}

export default SalesDashboardHeader
