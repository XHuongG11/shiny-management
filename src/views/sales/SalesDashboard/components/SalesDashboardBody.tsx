import Loading from '@/components/shared/Loading'
import { useAppSelector } from '../store'
import LatestOrder from './LatestOrder'
import SalesByCategories from './SalesByCategories'
import SalesReport from './SalesReport'
import Statistic from './Statistic'
import TopProduct from './TopProduct'

const SalesDashboardBody = () => {
    const dashboardData = useAppSelector(
        (state) => state.salesDashboard.data.dashboardData,
    )

    const loading = useAppSelector((state) => state.salesDashboard.data.loading)

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
