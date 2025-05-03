import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    toggleResponseDialog,
    respondToReview,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { HiOutlineChatAlt } from 'react-icons/hi'
import dayjs from 'dayjs'

const RatingStars = ({ rating }: { rating: number }) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
        stars.push(
            <span 
                key={i} 
                className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        )
    }
    return <div className="flex">{stars}</div>
}

const ReviewResponseDialog = () => {
    const dispatch = useAppDispatch()
    const [response, setResponse] = useState('')
    
    const dialogOpen = useAppSelector(
        (state) => state.salesReviewList.data.responseDialogVisible
    )
    const review = useAppSelector(
        (state) => state.salesReviewList.data.selectedReview
    )
    const submitting = useAppSelector(
        (state) => state.salesReviewList.data.submitting
    )

    const onDialogClose = () => {
        dispatch(toggleResponseDialog(false))
        setResponse('')
    }

    const onRespond = async () => {
        if (!response.trim()) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please enter a response!
                </Notification>
            )
            return
        }

        if (review) {
            dispatch(respondToReview({ reviewId: review.id, content: response }))
                .unwrap()
                .then(() => {
                    toast.push(
                        <Notification title="Success" type="success">
                            Response sent successfully!
                        </Notification>
                    )
                    setResponse('')
                })
                .catch((err) => {
                    toast.push(
                        <Notification title="Error" type="danger">
                            {err.message || 'Failed to send response!'}
                        </Notification>
                    )
                })
        }
    }

    return (
        <Dialog
            isOpen={dialogOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            width={700}
        >
            <h5 className="mb-4">Review Response</h5>
            {review && (
                <div className="mb-6">
                    <Card bordered>
                        <div className="mb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {/* <Avatar text={review.reviewer.fullName.charAt(0)} /> */}
                                    <div className="ml-2">
                                        <h6>{review.reviewer.fullName}</h6>
                                        <span className="text-sm text-gray-500">
                                            {dayjs(review.createdAt).format('DD MMM YYYY, HH:mm')}
                                        </span>
                                    </div>
                                </div>
                                <RatingStars rating={review.rating} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <h6 className="mb-2">Product: {review.product.title}</h6>
                            <p className="mb-0">{review.content}</p>
                        </div>
                    </Card>
                </div>
            )}
            <div>
                <Input
                    textArea
                    placeholder="Write your response..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    disabled={submitting}
                    rows={5}
                />
                <div className="text-right mt-4">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        icon={<HiOutlineChatAlt />}
                        onClick={onRespond}
                        loading={submitting}
                    >
                        Send Response
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default ReviewResponseDialog