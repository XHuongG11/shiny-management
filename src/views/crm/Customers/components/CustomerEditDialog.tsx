import { useRef } from 'react'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import CustomerEditContent, { FormikRef } from './CustomerEditContent'
import {
    setDrawerClose,
    setSelectedCustomer,
    useAppDispatch,
    useAppSelector,
} from '../store'
import type { MouseEvent } from 'react'

type DrawerFooterProps = {
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

const DrawerFooter = ({ onCancel }: DrawerFooterProps) => {
    return (
        <div className="text-right w-full">
            <Button size="sm" onClick={onCancel}>
                Close
            </Button>
        </div>
    )
}

const CustomerEditDialog = () => {
    const dispatch = useAppDispatch()
    const drawerOpen = useAppSelector(
        (state) => state.crmCustomers.data.drawerOpen
    )

    const onDrawerClose = () => {
        dispatch(setDrawerClose())
        dispatch(setSelectedCustomer({}))
    }

    const formikRef = useRef<FormikRef>(null)

    return (
        <Drawer
            isOpen={drawerOpen}
            closable={true}
            title="Customer Details"
            bodyClass="p-0"
            footer={<DrawerFooter onCancel={onDrawerClose} />}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
        >
            <CustomerEditContent ref={formikRef} />
        </Drawer>
    )
}

export default CustomerEditDialog