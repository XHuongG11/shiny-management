import { useState } from 'react'
import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import VoucherTable from './components/VoucherTable'
import VoucherTableTools from './components/VoucherTableTools'
import VoucherDeleteConfirmation from './components/VoucherDeleteConfirmation'
import VoucherForm from './components/VoucherForm'
import { useAppSelector } from './store'

injectReducer('salesVoucherList', reducer)

const VoucherList = () => {
    const [voucherFormOpen, setVoucherFormOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)
    
    const selectedVoucher = useAppSelector(
        (state) => state.salesVoucherList.data.selectedVoucher
    )

    const onAddVoucher = () => {
        setVoucherFormOpen(true)
        setEditMode(false)
    }

    const onEditVoucher = () => {
        if (selectedVoucher) {
            setVoucherFormOpen(true)
            setEditMode(true)
        }
    }

    const onVoucherFormClose = () => {
        setVoucherFormOpen(false)
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Vouchers</h3>
                <VoucherTableTools 
                    onAddVoucher={onAddVoucher}
                />
            </div>
            <VoucherTable onEdit={onEditVoucher} />
            <VoucherDeleteConfirmation />
            <VoucherForm 
                open={voucherFormOpen} 
                onClose={onVoucherFormClose} 
                editMode={editMode} 
            />
        </AdaptableCard>
    )
}

export default VoucherList