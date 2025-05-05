import StaffForm from "../StaffForm/StaffForm";
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '@/components/shared/Loading'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { Staff } from "@/@types/staff";
import { apiGetStaffById } from "@/services/StaffService";

const StaffEdit = () => {
    const { sid } = useParams()
    const navigate = useNavigate()
    const [staff, setStaff] = useState<Staff | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const id = parseInt(sid as string)
                if (isNaN(id)) {
                    toast.push(
                        <Notification title="Error" type="danger">
                            Invalid staff ID
                        </Notification>
                    )
                    navigate(`${APP_PREFIX_PATH}/staffs`)
                    return
                }
                
                const response = await apiGetStaffById<{ code: string; message: string; data: Staff }>(id)
                
                if (response.data && response.data.code === "200") {
                    setStaff(response.data.data)
                } else {
                    toast.push(
                        <Notification title="Error" type="danger">
                            {response.data?.message || 'Failed to load staff'}
                        </Notification>
                    )
                    navigate(`${APP_PREFIX_PATH}/staffs`)
                }
            } catch (error: any) {
                toast.push(
                    <Notification title="Error" type="danger">
                        {error.response?.data?.message || 'Failed to load staff'}
                    </Notification>
                )
                navigate(`${APP_PREFIX_PATH}/staffs`)
            } finally {
                setLoading(false)
            }
        }
        fetchStaff()
    }, [sid, navigate])

    if (loading) {
        return <Loading loading={true} />
    }

    return (
        <div className="staff-edit">
            {staff && <StaffForm isEdit={true} staff={staff} />}
        </div>
    );
};

export default StaffEdit;