import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Container from '@/components/shared/Container';
import Loading from '@/components/shared/Loading';
import Tag from '@/components/ui/Tag';
import { getOrderById, updateOrderStatusById } from '@/services/SalesService';
import { OrderResponse } from '@/@types/order';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

const ReturnProcessingPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (orderId) fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await getOrderById<OrderResponse>(orderId!);
            setOrder(response.data.data || null);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch order details');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (status: 'RETURNED' | 'RETURN_REJECTED') => {
        if (!orderId) return;
        try {
            setLoading(true);
            await updateOrderStatusById(orderId, status);
            setNotification({
                type: 'success',
                message: `Return ${status === 'RETURNED' ? 'approved' : 'rejected'} successfully!`,
            });
            setTimeout(() => {
                setNotification(null);
                navigate(`${APP_PREFIX_PATH}/orders`);
            }, 2000);
        } catch (err: any) {
            setNotification({
                type: 'error',
                message: err.response?.data?.message || 'Failed to process return',
            });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const returnItem = order?.orderItems?.[0]?.returnItem;
    const product = order?.orderItems?.[0]?.product;

    return (
        <Container className="min-h-screen py-8">
            <Loading loading={loading}>
                {order && returnItem ? (
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                Return Request #{orderId}
                            </h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Order Date: {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Product Card */}
                        <div className="flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-all hover:shadow-md">
                            <img
                                src={product?.images[0]?.url || '/placeholder.png'}
                                alt={product?.title || 'Product image'}
                                className="w-48 h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                            <div className="flex flex-col justify-between flex-1">
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                        {product?.title || 'Product name'}
                                    </h4>
                                    <div className="mt-2 space-y-2">
                                        <p className="text-base font-bold text-gray-600 dark:text-gray-300">
                                            Quantity: <span className="font-medium">{returnItem.quantity || 1}</span>
                                        </p>
                                        <p className="text-base font-bold text-gray-600 dark:text-gray-300">
                                            Return Reason:{' '}
                                            <Tag
                                                className={classNames(
                                                    'inline-block ml-1 text-sm',
                                                    returnItem.reason === 'SIZE_PROBLEM'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-200'
                                                )}
                                            >
                                                {returnItem.reason === 'SIZE_PROBLEM'
                                                    ? 'Size Problem'
                                                    : returnItem.reason || 'Unknown'}
                                            </Tag>
                                        </p>
                                        <p className="text-base font-bold text-gray-600 dark:text-gray-300">
                                            Description:{' '}
                                            <span className="italic">
                                                {returnItem.description || 'ấdsas'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proof Images */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                Proof Images
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {returnItem.proofImages?.length ? (
                                    returnItem.proofImages.map((image) => (
                                        <a
                                            key={image.id}
                                            href={image.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block group"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 transition-transform group-hover:scale-105"
                                            />
                                        </a>
                                    ))
                                ) : (
                                    <span className="text-gray-500 dark:text-gray-400 col-span-full">
                                        No proof images provided
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => handleUpdateStatus('RETURNED')}
                            className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('RETURN_REJECTED')}
                            className="bg-rose-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-rose-600 transition-colors"
                        >
                            Reject
                        </button>
                    </div>

                    </div>
                ) : !loading ? (
                    <div className="min-h-[50vh] flex flex-col items-center justify-center">
                        <h3 className="text-xl text-red-500 font-medium">
                            {error || 'No return request found.'}
                        </h3>
                    </div>
                ) : null}

                {/* Notification */}
                {notification && (
                    <div
                        className={classNames(
                            'fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl z-50 transition-all duration-300',
                            notification.type === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-red-500 text-white'
                        )}
                    >
                        {notification.message}
                    </div>
                )}
            </Loading>
        </Container>
    );
};

export default ReturnProcessingPage;