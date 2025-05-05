import { useState, useEffect } from 'react';
import classNames from 'classnames';
import Tag from '@/components/ui/Tag';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/shared/Loading';
import Container from '@/components/shared/Container';
import DoubleSidedImage from '@/components/shared/DoubleSidedImage';
import OrderProducts from './components/OrderProducts';
import CustomerInfo from './components/CustomerInfo';
import { HiOutlineCalendar } from 'react-icons/hi';
import { getOrderById, updateOrderStatusById } from '@/services/SalesService';
import { useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import { OrderResponse, OrderItem } from '@/@types/order';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

const statusDisplayMap: Record<
    string,
    { label: string; dotClass: string; textClass: string }
> = {
    RETURN_REQUESTED: {
        label: 'RETURN REQUESTED',
        dotClass: 'bg-purple-500',
        textClass: 'text-purple-500',
    },
    PENDING: {
        label: 'PENDING',
        dotClass: 'bg-lime-500',
        textClass: 'text-lime-500',
    },
    SHIPPING: {
        label: 'SHIPPING',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    CANCELLED: {
        label: 'CANCELLED',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    COMPLETED: {
        label: 'COMPLETED',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    CONFIRMED: {
        label: 'CONFIRMED',
        dotClass: 'bg-orange-500',
        textClass: 'text-orange-500',
    },
    DELIVERED: {
        label: 'DELIVERED',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
    RETURNED: {
        label: 'RETURNED',
        dotClass: 'bg-gray-500',
        textClass: 'text-gray-500',
    },
    RETURN_REJECTED: {
        label: 'RETURN REJECTED',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    UNKNOWN: {
        label: 'UNKNOWN',
        dotClass: 'bg-neutral-400',
        textClass: 'text-neutral-400',
    },
};

const paymentMethodDisplay: Record<
    string,
    { label: string; class: string }
> = {
    COD: {
        label: 'CASH TO DELIVERY',
        class: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-blue-100',
    },
    VN_PAY: {
        label: 'VNPAY',
        class: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100',
    },
    MOMO: {
        label: 'MOMO',
        class: 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-100',
    },
    unknown: {
        label: 'Unknown',
        class: 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100',
    },
};

const OrderDetails = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<OrderResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
    const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async () => {
        const id = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        );
        if (id) {
            setLoading(true);
            try {
                const response = await getOrderById<OrderResponse>(id);
                setData(response.data.data || null);
                setError(null);
            } catch (error: any) {
                setData(null);
                setError(error.response?.data?.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        }
    };

    const transformOrderItems = (orderItems: OrderItem[] | undefined) => {
        if (!orderItems) return [];
        return orderItems.map(item => ({
            id: String(item.id || item.product?.id || ''),
            name: item.product?.title || 'N/A',
            productCode: String(item.product?.id || ''),
            img: item.product?.images?.[0]?.url || '/img/placeholder.png',
            price: item.price || 0,
            quantity: item.quantity || 0,
            total: item.totalPrice || 0,
            details: item.product?.attributes?.reduce((acc, attr) => {
                acc[attr.name] = [attr.value];
                return acc;
            }, {} as Record<string, string[]>) || {},
        }));
    };

    const getCustomerData = (order: OrderResponse | null) => {
        if (!order || !order.shippingAddress) return undefined;
        return {
            name: order.shippingAddress.recipientName || 'N/A',
            email: 'customer@example.com',
            phone: order.shippingAddress.recipientPhone || 'N/A',
            img: '/img/avatars/1.png',
            previousOrder: 5,
            shippingAddress: {
                line1: order.shippingAddress.address || 'N/A',
                line2: order.shippingAddress.village || 'N/A',
                line3: order.shippingAddress.district || 'N/A',
                line4: order.shippingAddress.province || 'N/A',
            },
            billingAddress: {
                line1: order.shippingAddress.address || 'N/A',
                line2: order.shippingAddress.village || 'N/A',
                line3: order.shippingAddress.district || 'N/A',
                line4: order.shippingAddress.province || 'N/A',
            },
        };
    };

    const formatNumber = (value: number | undefined, fallback: string = '0') => {
        return value !== undefined
            ? value.toLocaleString('en-US', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
              })
            : fallback;
    };

    const handleConfirmOrder = async () => {
        if (!data?.id) return;
        setLoading(true);
        try {
            const response = await updateOrderStatusById<{ success: boolean }>(data.id, 'CONFIRMED');
            console.log('Update status response:', response);
            await fetchData();
            setNotificationType('success');
            setNotificationMessage('Order confirmed successfully!');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage(null);
            }, 3000);
        } catch (error: any) {
            console.error('Failed to confirm order:', error);
            setNotificationType('error');
            setNotificationMessage(error.response?.data?.message || 'Failed to confirm order');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!data?.id) return;
        setLoading(true);
        try {
            const response = await updateOrderStatusById<{ success: boolean }>(data.id, 'CANCELLED');
            console.log('Cancel order response:', response);
            await fetchData();
            setNotificationType('success');
            setNotificationMessage('Order cancelled successfully!');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage(null);
            }, 3000);
        } catch (error: any) {
            console.error('Failed to cancel order:', error);
            setNotificationType('error');
            setNotificationMessage(error.response?.data?.message || 'Failed to cancel order');
            setShowNotification(true);
            setTimeout(() => {
                setShowNotification(false);
                setNotificationMessage(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // New handler for processing return request
    const handleProcessReturn = () => {
        if (!data?.id) return;
        // Navigate to the return processing page with the order ID
        navigate(`${APP_PREFIX_PATH}/order-details/return/${data.id}`);
    };

    console.log('Current data state:', data);

    return (
        <Container className="h-full relative">
            <Loading loading={loading}>
                {data && !isEmpty(data) && (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center mb-2">
                                <h3>
                                    <span>Order</span>
                                    <span className="ltr:ml-2 rtl:mr-2">
                                        #{data.id || 'Unknown'}
                                    </span>
                                </h3>
                                <Tag
                                    className={classNames(
                                        'border-0 rounded-md ltr:ml-2 rtl:mr-2',
                                        paymentMethodDisplay[
                                            data.paymentMethod in paymentMethodDisplay
                                                ? data.paymentMethod
                                                : 'unknown'
                                        ].class
                                    )}
                                >
                                    {
                                        paymentMethodDisplay[
                                            data.paymentMethod in paymentMethodDisplay
                                                ? data.paymentMethod
                                                : 'unknown'
                                        ].label
                                    }
                                </Tag>
                                <div className="flex items-center ltr:ml-2 rtl:mr-2">
                                    <Badge
                                        className={
                                            statusDisplayMap[
                                                data.status in statusDisplayMap
                                                    ? data.status
                                                    : 'unknown'
                                            ].dotClass
                                        }
                                    />
                                    <span
                                        className={classNames(
                                            'ml-2 rtl:mr-2 capitalize font-semibold',
                                            statusDisplayMap[
                                                data.status in statusDisplayMap
                                                    ? data.status
                                                    : 'unknown'
                                            ].textClass
                                        )}
                                    >
                                        {
                                            statusDisplayMap[
                                                data.status in statusDisplayMap
                                                    ? data.status
                                                    : 'unknown'
                                            ].label
                                        }
                                    </span>
                                </div>
                                {data.status === 'PENDING' && (
                                    <button
                                        onClick={handleConfirmOrder}
                                        className="ltr:ml-4 rtl:mr-4 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 font-bold"
                                    >
                                        Confirm Order
                                    </button>
                                )}
                                {data.status === 'RETURN_REQUESTED' && (
                                    <button
                                        onClick={handleProcessReturn} // Use the new handler
                                        className="ltr:ml-4 rtl:mr-4 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 font-bold"
                                    >
                                        Process Request
                                    </button>
                                )}
                            </div>
                            <span className="flex items-center">
                                <HiOutlineCalendar className="text-lg" />
                                <span className="ltr:ml-1 rtl:mr-1">
                                    {data.orderDate
                                        ? dayjs(data.orderDate).format('ddd DD-MMM-YYYY, hh:mm A')
                                        : 'N/A'}
                                </span>
                            </span>
                        </div>
                        <div className="xl:flex gap-4">
                            <div className="w-full xl:w-3/4">
                                <OrderProducts data={transformOrderItems(data.orderItems)} />
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4">
                                    <h4 className="mb-4 font-semibold text-lg">Order Summary</h4>
                                    <dl className="grid grid-cols-2 gap-2">
                                        <dt className="font-medium text-gray-600 dark:text-gray-400">
                                            Total Product Price:
                                        </dt>
                                        <dd className="text-right">
                                            {formatNumber(data.totalProductPrice)} VNĐ
                                        </dd>
                                        <dt className="font-medium text-gray-600 dark:text-gray-400">
                                            Promotion Discount:
                                        </dt>
                                        <dd className="text-right">
                                            {formatNumber(data.promotionDiscount)} VNĐ
                                        </dd>
                                        <dt className="font-medium text-gray-600 dark:text-gray-400">
                                            Free Ship Discount:
                                        </dt>
                                        <dd className="text-right">
                                            {formatNumber(data.freeShipDiscount)} VNĐ
                                        </dd>
                                        <dt className="font-medium text-gray-600 dark:text-gray-400">
                                            Shipping Fee:
                                        </dt>
                                        <dd className="text-right">
                                            {formatNumber(data.shippingFee)} VNĐ
                                        </dd>
                                        <dt className="font-medium text-gray-600 dark:text-gray-400">
                                            Total Price:
                                        </dt>
                                        <dd className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                                            {formatNumber(data.totalPrice)} VNĐ
                                        </dd>
                                        <dt className="font-medium text-gray-600 dark:text-gray-400">
                                            Shipping Method:
                                        </dt>
                                        <dd className="text-right">
                                            {data.shippingMethod || 'N/A'}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                            <div className="w-full xl:w-1/4">
                                <CustomerInfo data={getCustomerData(data)} />
                            </div>
                        </div>
                        {data.status === 'PENDING' && (
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={handleCancelOrder}
                                    className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 font-bold"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Loading>
            {!loading && (!data || isEmpty(data)) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="Error loading order"
                    />
                    <h3 className="mt-8">{error || 'No order found!'}</h3>
                </div>
            )}
            {showNotification && notificationMessage && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
                        notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
                    } text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300`}
                    style={{ display: showNotification ? 'block' : 'none' }}
                >
                    {notificationMessage}
                </div>
            )}
        </Container>
    );
};

export default OrderDetails;