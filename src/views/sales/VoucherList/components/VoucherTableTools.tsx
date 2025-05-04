import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import VoucherTableSearch from './VoucherTableSearch'

type VoucherTableToolsProps = {
    onAddVoucher: () => void
}

const VoucherTableTools = ({ onAddVoucher }: VoucherTableToolsProps) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center gap-4">
            <VoucherTableSearch />
            <Button
                size="sm"
                variant="solid"
                onClick={onAddVoucher}
                icon={<HiPlusCircle />}
            >
                Add Voucher
            </Button>
        </div>
    )
}

export default VoucherTableTools