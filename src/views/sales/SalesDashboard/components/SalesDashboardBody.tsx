import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import Statistic from './Statistic'
import SalesReport from './SalesReport'
import SalesByCategories from './SalesByCategories'
import LatestOrder from './LatestOrder'
import TopProduct from './TopProduct'
import { getSalesDashboardData, useAppSelector } from '../store'
import { useAppDispatch } from '@/store'

const SalesDashboardBody = () => {
    const dispatch = useAppDispatch()

    const dashboardData = useAppSelector(
        (state) => state.salesDashboard.data.dashboardData,
    )
    const month = useAppSelector((state) => state.salesDashboard.data.month)
    const year = useAppSelector((state) => state.salesDashboard.data.year)
    const loading = useAppSelector((state) => state.salesDashboard.data.loading)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        console.log('month2', month, 'year2', year)
        dispatch(getSalesDashboardData({ month, year }))
    }

    return (
        <Loading loading={loading}>
            <Statistic data={dashboardData?.salesTotal} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <SalesReport
                    data={dashboardData?.salesReportData}
                    className="col-span-2"
                />
                <SalesByCategories
                    data={dashboardData?.salesByCategoriesData}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <TopProduct
                    data={dashboardData?.topProductsData}
                    className="lg:col-span-3"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <LatestOrder
                    data={dashboardData?.latestOrderData}
                    className="lg:col-span-3"
                />
            </div>
        </Loading>
    )
}

export default SalesDashboardBody
