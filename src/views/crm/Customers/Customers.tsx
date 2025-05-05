import AdaptableCard from '@/components/shared/AdaptableCard'
import CustomersTable from './components/CustomersTable'
import { injectReducer } from '@/store'
import reducer from './store'
import CustomerBan from './components/CustomerBan'
import CustomerTableTools from './components/CustomerTableTools'

injectReducer('crmCustomers', reducer)

const Customers = () => {
    return (
            <AdaptableCard className="h-full" bodyClass="h-full">
                <div className="lg:flex items-center justify-between mb-4">
                    <h3 className="mb-4 lg:mb-0">Customers</h3>
                    <CustomerTableTools />
                </div>
                <CustomersTable />
                <CustomerBan />
            </AdaptableCard>
    );
};

export default Customers
