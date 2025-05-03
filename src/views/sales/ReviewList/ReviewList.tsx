import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ReviewTable from './components/ReviewTable'
import ReviewResponseDialog from './components/ReviewResponseDialog'

injectReducer('salesReviewList', reducer)

const ReviewList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Customer Reviews</h3>
            </div>
            <ReviewTable />
            <ReviewResponseDialog />
        </AdaptableCard>
    )
}

export default ReviewList