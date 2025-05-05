import { forwardRef } from 'react'
import { useAppSelector } from '../store'
import CustomerForm, { FormikRef } from '@/views/crm/CustomerForm'

const CustomerEditContent = forwardRef<FormikRef>((_, ref) => {
    const customer = useAppSelector(
        (state) => state.crmCustomers.data.selectedCustomer
    )

    return (
        <CustomerForm
            ref={ref}
            customer={customer}
            readOnly={true}
        />
    )
})

CustomerEditContent.displayName = 'CustomerEditContent'

export type { FormikRef }

export default CustomerEditContent