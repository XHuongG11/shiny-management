import Button from '@/components/ui/Button'
import { HiDownload, HiOutlineTrash } from 'react-icons/hi'
import OrderTableSearch from './OrderTableSearch'
import { toggleDeleteConfirmation, useAppDispatch, useAppSelector } from '../store'
import { Link } from 'react-router-dom'

const DeleteButton = () => {
    const dispatch = useAppDispatch()

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
    }

    return (
        <Button
            variant="solid"
            color="red-600"
            size="sm"
            icon={<HiOutlineTrash />}
            onClick={onDelete}
        >
            Delete
        </Button>
    )
}

const OrdersTableTools = () => {
    const selectedOrder = useAppSelector(
        (state) => state.salesOrderList.data.selectedOrder
    )

    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {selectedOrder && <DeleteButton />}
            <Link download to="/data/order-list.csv" target="_blank">
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
            <OrderTableSearch />
        </div>
    )
}

export default OrdersTableTools