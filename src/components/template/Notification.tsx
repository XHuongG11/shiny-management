import { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import {
    HiOutlineBell,
    HiOutlineMailOpen,
    HiOutlineTrash,
} from 'react-icons/hi'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
    apiMarkNotificationAsRead,
    apiMarkAllNotificationsAsRead,
    apiDeleteNotification,
    apiDeleteAllNotifications,
} from '@/services/CommonService'
import isLastChild from '@/utils/isLastChild'
import useTwColorByName from '@/utils/hooks/useTwColorByName'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import acronym from '@/utils/acronym'
import { ApiResponse } from '@/@types/auth'

type NotificationList = {
    id: number
    title: string
    content: string
    status: string
    sentAt: string
}

const notificationHeight = 'h-72'


const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div className={classNames('text-2xl', className)}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <HiOutlineBell />
                </Badge>
            ) : (
                <HiOutlineBell />
            )}
        </div>
    )
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationList[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const { bgTheme } = useThemeClass()

    const { larger } = useResponsive()

    const direction = useAppSelector((state) => state.theme.direction)

    const getNotificationCount = useCallback(async () => {
        const resp = await apiGetNotificationCount<ApiResponse<number>>()
        if (resp.data.data > 0) {
            setNoResult(false)
            setUnreadNotification(true)
        } else {
            setNoResult(true)
        }
    }, [setUnreadNotification])

    const fetchNotifications = useCallback(async () => {
        setLoading(true)
        const resp = await apiGetNotificationList()
        setLoading(false)
        setNotificationList(resp.data.data.content)
        if (resp.data.data.content.length === 0) {
            setNoResult(true)
        } else {
            setNoResult(false)
        }
    }, [])

    useEffect(() => {
        getNotificationCount()
    }, [getNotificationCount])

    const onNotificationOpen = useCallback(async () => {
        if (notificationList.length === 0) {
            await fetchNotifications()
        }
    }, [notificationList, fetchNotifications])

    const onMarkAllAsRead = useCallback(async () => {
        try {
            await apiMarkAllNotificationsAsRead()
            const list = notificationList.map((item: NotificationList) => {
                if (item.status !== 'READ') {
                    item.status = 'READ'
                }
                return item
            })
            setNotificationList(list)
            setUnreadNotification(false)
        } catch (error) {
            console.error('Failed to mark all as read', error)
        }
    }, [notificationList])

    const onMarkAsRead = useCallback(
        async (id: number, e: React.MouseEvent) => {
            e.stopPropagation() // Prevent click from bubbling to parent
            try {
                await apiMarkNotificationAsRead(id)
                const list = notificationList.map((item) => {
                    if (item.id === id) {
                        item.status = 'READ'
                    }
                    return item
                })
                setNotificationList(list)
                const hasUnread = list.some((item) => item.status !== 'READ')
                setUnreadNotification(hasUnread)
            } catch (error) {
                console.error('Failed to mark as read', error)
            }
        },
        [notificationList]
    )

    const onDeleteNotification = useCallback(
        async (id: number, e: React.MouseEvent) => {
            e.stopPropagation() // Prevent click from bubbling to parent
            try {
                await apiDeleteNotification(id)
                const filteredList = notificationList.filter(
                    (item) => item.id !== id
                )
                setNotificationList(filteredList)
                if (filteredList.length === 0) {
                    setNoResult(true)
                }
                const hasUnread = filteredList.some((item) => item.status !== 'READ')
                setUnreadNotification(hasUnread)
            } catch (error) {
                console.error('Failed to delete notification', error)
            }
        },
        [notificationList]
    )

    const onDeleteAllNotifications = useCallback(async () => {
        try {
            await apiDeleteAllNotifications()
            setNotificationList([])
            setNoResult(true)
            setUnreadNotification(false)
        } catch (error) {
            console.error('Failed to delete all notifications', error)
        }
    }, [])

    return (
        <Dropdown
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="p-0 min-w-[280px] md:min-w-[340px]"
            placement={larger.md ? 'bottom-end' : 'bottom-center'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                    <h6>Notifications</h6>
                    <div className="flex">
                        <Tooltip title="Mark all as read">
                            <Button
                                variant="plain"
                                shape="circle"
                                size="sm"
                                icon={<HiOutlineMailOpen className="text-xl" />}
                                onClick={onMarkAllAsRead}
                                className="mr-1"
                            />
                        </Tooltip>
                        <Tooltip title="Delete all notifications">
                            <Button
                                variant="plain"
                                shape="circle"
                                size="sm"
                                icon={<HiOutlineTrash className="text-xl" />}
                                onClick={onDeleteAllNotifications}
                            />
                        </Tooltip>
                    </div>
                </div>
            </Dropdown.Item>
            <div className={classNames('overflow-y-auto', notificationHeight)}>
                <ScrollBar direction={direction}>
                    {notificationList.length > 0 &&
                        notificationList.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative flex px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20 ${
                                    !isLastChild(notificationList, index)
                                        ? 'border-b border-gray-200 dark:border-gray-600'
                                        : ''
                                }`}
                            >
                                <div className="ltr:ml-3 rtl:mr-3 flex-grow">
                                    <div>
                                        {item.title && (
                                            <span className="font-semibold heading-text">
                                                {item.title}{' '}
                                            </span>
                                        )}
                                        <span>{item.content}</span>
                                    </div>
                                    <span className="text-xs">
                                        {new Date(item.sentAt).toLocaleString('en-GB', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    {item.status !== 'READ' && (
                                        <Tooltip title="Mark as read">
                                            <Button
                                                variant="plain"
                                                shape="circle"
                                                size="xs"
                                                icon={<HiOutlineMailOpen className="text-lg" />}
                                                onClick={(e) => onMarkAsRead(item.id, e)}
                                                className="mr-1"
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Delete notification">
                                        <Button
                                            variant="plain"
                                            shape="circle"
                                            size="xs"
                                            icon={<HiOutlineTrash className="text-lg" />}
                                            onClick={(e) => onDeleteNotification(item.id, e)}
                                        />
                                    </Tooltip>
                                </div>
                                <Badge
                                    className="absolute top-4 ltr:right-16 rtl:left-16 mt-1.5"
                                    innerClass={`${
                                        item.status === 'READ' ? 'bg-gray-300' : bgTheme
                                    } `}
                                />
                            </div>
                        ))}
                    {loading && (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight
                            )}
                        >
                            <Spinner size={40} />
                        </div>
                    )}
                    {noResult && !loading && (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight
                            )}
                        >
                            <div className="text-center">
                                <img
                                    className="mx-auto mb-2 max-w-[150px]"
                                    src="/img/others/no-notification.png"
                                    alt="no-notification"
                                />
                                <h6 className="font-semibold">
                                    No notifications!
                                </h6>
                                <p className="mt-1">Please Try again later</p>
                            </div>
                        </div>
                    )}
                </ScrollBar>
            </div>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
