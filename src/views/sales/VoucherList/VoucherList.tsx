import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import VoucherTable from './components/VoucherTable'
import VoucherTableTools from './components/VoucherTableTools'
import VoucherDeleteConfirmation from './components/VoucherDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

injectReducer('salesVoucherList', reducer)

const VoucherList = () => {
    const navigate = useNavigate()

    const onAddVoucher = () => {
        navigate(`${APP_PREFIX_PATH}/vouchers/add`)
    }

    const onEditVoucher = (voucherId: number) => {
        navigate(`${APP_PREFIX_PATH}/vouchers/${voucherId}`)
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Vouchers</h3>
                <VoucherTableTools onAddVoucher={onAddVoucher} />
            </div>
            <VoucherTable onEdit={onEditVoucher} />
            <VoucherDeleteConfirmation />
        </AdaptableCard>
    )
}

export default VoucherList