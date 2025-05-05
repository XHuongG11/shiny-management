import { injectReducer } from '@/store';
import reducer from './store';
import AdaptableCard from '@/components/shared/AdaptableCard';
import StaffTable from './components/StaffTable';
import StaffTableTools from './components/StaffTableTools';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from '@/constants/route.constant';
import StaffDelete from './components/StaffDelete';
import StaffBan from './components/StaffBan';

injectReducer('staffManagement', reducer);

const StaffManagement = () => {
    const navigate = useNavigate();

    const handleAddStaff = () => {
        navigate(`${APP_PREFIX_PATH}/staffs/add`);
    };

    const handleEditStaff = (staffId: number) => {
        navigate(`${APP_PREFIX_PATH}/staffs/${staffId}`);
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Staffs</h3>
                <StaffTableTools onAddStaff={handleAddStaff} />
            </div>
            <StaffTable onEdit={handleEditStaff} />
            <StaffDelete />
            <StaffBan />
        </AdaptableCard>
    );
};

export default StaffManagement;