import Chart from '@/components/shared/Chart'
import Card from '@/components/ui/Card'

type SalesReportProps = {
    data?: {
        series?: {
            name: string
            data: number[]
        }[]
        categories?: {
            month: number
            categoryRevenueItems: {
                categoryId: number
                categoryName: string
                revenue: number
            }[]
        }[]
    }
    className?: string
}

const SalesReport = ({ className, data = {} }: SalesReportProps) => {
    const flatData = data?.series?.map((item) => item.data[0]) ?? []

    const categories = data?.categories?.[0]?.categoryRevenueItems?.map(
        (c) => c.categoryName,
    )

    const chartCategoies = categories?.map((catName) => ({
        name: catName,
        data:
            data?.categories?.map((monthObj) => {
                const item = monthObj.categoryRevenueItems.find(
                    (c) => c.categoryName === catName,
                )
                return item?.revenue ?? 0
            }) ?? [],
    }))

    const chartSeries = [
        {
            name: 'Revenue',
            data: flatData ?? [],
        },
        ...(chartCategoies ?? []),
    ]
    console.log('chartSeries', chartSeries)
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    return (
        <Card className={className}>
            <div className="flex items-center justify-between">
                <h4>Sales Report</h4>
                {/* <Button size="sm">Export Report</Button> */}
            </div>
            <Chart
                series={chartSeries}
                xAxis={months}
                height="380px"
                customOptions={{ legend: { show: false } }}
            />
        </Card>
    )
}

export default SalesReport
