import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import { useAppSelector } from '../store'

type StatisticCardProps = {
    data?: number
    label: string
    valuePrefix?: string
    month: number
    year: number
}

type StatisticProps = {
    data?: {
        revenue?: number
        orders?: number
        customers?: number
        returnOrders?: number
    }
}

const StatisticCard = ({
    data = 0,
    label,
    valuePrefix,
    month,
    year,
}: StatisticCardProps) => {
    return (
        <Card>
            <h6 className="font-semibold mb-4 text-sm">{label}</h6>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="font-bold">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={
                                typeof data === 'number' ||
                                typeof data === 'string'
                                    ? data
                                    : ''
                            }
                            prefix={valuePrefix}
                        />
                    </h3>
                    <p>
                        {month}/{year}
                    </p>
                </div>
            </div>
        </Card>
    )
}

const Statistic = ({ data = {} }: StatisticProps) => {
    const month = useAppSelector((state) => state.salesDashboard.data.month)
    const year = useAppSelector((state) => state.salesDashboard.data.year)
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <StatisticCard
                data={data.revenue}
                valuePrefix="VND "
                label="Revenue"
                month={month}
                year={year}
            />
            <StatisticCard
                data={data.orders}
                label="Orders"
                month={month}
                year={year}
            />
            <StatisticCard
                data={data.customers}
                label="New Customers"
                month={month}
                year={year}
            />
            <StatisticCard
                data={data.returnOrders}
                label="Return Orders"
                month={month}
                year={year}
            />
        </div>
    )
}

export default Statistic
