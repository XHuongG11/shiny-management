import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VoucherForm from '../VoucherForm/VoucherForm'
import { apiGetVoucher } from '@/services/VoucherService'
import { Voucher } from '@/@types/voucher'
import Loading from '@/components/shared/Loading'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

const VoucherEdit = () => {
    const { voucherId } = useParams()
    const navigate = useNavigate()
    const [voucher, setVoucher] = useState<Voucher | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVoucher = async () => {
            try {
                const id = parseInt(voucherId as string)
                if (isNaN(id)) {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Invalid voucher ID
                        </Notification>
                    )
                    navigate(`${APP_PREFIX_PATH}/vouchers`)
                    return
                }
                
                const response = await apiGetVoucher<{ code: string; message: string; data: Voucher }>(id)
                
                if (response.data && response.data.code === "200") {
                    setVoucher(response.data.data)
                } else {
                    toast.push(
                        <Notification title="Error" type="danger">
                            {response.data?.message || 'Failed to load voucher'}
                        </Notification>
                    )
                    navigate(`${APP_PREFIX_PATH}/vouchers`)
                }
            } catch (error: any) {
                toast.push(
                    <Notification title="Error" type="danger">
                        {error.response?.data?.message || 'Failed to load voucher'}
                    </Notification>
                )
                navigate(`${APP_PREFIX_PATH}/vouchers`)
            } finally {
                setLoading(false)
            }
        }
        fetchVoucher()
    }, [voucherId, navigate])

    if (loading) {
        return <Loading loading={true} />
    }

    return (
        <div>
            {voucher && <VoucherForm data={voucher} isEdit={true} />}
        </div>
    )
}

export default VoucherEdit