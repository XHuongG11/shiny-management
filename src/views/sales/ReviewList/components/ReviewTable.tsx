import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { HiOutlineChatAlt } from 'react-icons/hi'
import {
    getReviews,
    setTableData,
    setSelectedReview,
    toggleResponseDialog,
    useAppDispatch,
    useAppSelector,
} from '../store'
import cloneDeep from 'lodash/cloneDeep'
import dayjs from 'dayjs'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import type { ReviewData } from '@/@types/review'
import { FiPackage } from 'react-icons/fi'

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

const ProductColumn = ({ review }: { review: ReviewData }) => {
    const avatar = review.product && review.product.images && review.product.images.length > 0 
        ? <Avatar src={review.product.images[0].url} />
        : <Avatar icon={<FiPackage />} />

    return (
        <div className="flex items-center">
            {avatar}
            <span className={`ml-2 rtl:mr-2 font-semibold`}>{review.product.title}</span>
        </div>
    )
}

const ReviewerColumn = ({ review }: { review: ReviewData }) => {
    return (
        <span className="font-semibold">{review.reviewer.fullName}</span>
    )
}

const ActionColumn = ({ review }: { review: ReviewData }) => {
    const dispatch = useAppDispatch()

    const onRespond = () => {
        dispatch(setSelectedReview(review))
        dispatch(toggleResponseDialog(true))
    }

    return (
        <div className="flex justify-end">
            {review.response === null && (
                <Button
                    size="sm"
                    variant="twoTone"
                    icon={<HiOutlineChatAlt />}
                    onClick={onRespond}
                >
                    Respond
                </Button>
            )}
            {review.response !== null && (
                <Badge className="bg-emerald-500">Responded</Badge>
            )}
        </div>
    )
}

const ReviewTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()

    const { page, size, sort, totalPages } = useAppSelector(
        (state) => state.salesReviewList.data.tableData
    )

    const loading = useAppSelector((state) => state.salesReviewList.data.loading)
    const data = useAppSelector((state) => state.salesReviewList.data.reviewList)

    useEffect(() => {
        fetchData()
    }, [page, size, sort])

    const tableData = useMemo(
        () => ({ page, size, sort, totalPages }),
        [page, size, sort, totalPages]
    )

    const fetchData = () => {
        dispatch(getReviews({ page: page ?? 1, size: size ?? 10 }))
    }

    const columns: ColumnDef<ReviewData>[] = useMemo(
        () => [
            {
                header: 'Product',
                accessorKey: 'product',
                cell: (props) => <ProductColumn review={props.row.original} />
            },
            {
                header: 'Reviewer',
                accessorKey: 'reviewer',
                cell: (props) => <ReviewerColumn review={props.row.original} />
            },
            {
                header: 'Rating',
                accessorKey: 'rating',
                cell: (props) => <RatingStars rating={props.row.original.rating} />
            },
            {
                header: 'Content',
                accessorKey: 'content',
                cell: (props) => {
                    const content = props.row.original.content
                    return (
                        <div className="max-w-[300px] truncate">
                            {content}
                        </div>
                    )
                }
            },
            {
                header: 'Date',
                accessorKey: 'createdAt',
                cell: (props) => (
                    <span>{dayjs(props.row.original.createdAt).format('DD/MM/YYYY HH:mm')}</span>
                )
            },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn review={props.row.original} />
            }
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.page = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.size = Number(value)
        newTableData.page = 1
        dispatch(setTableData(newTableData))
    }

    return (
        <DataTable
            ref={tableRef}
            columns={columns}
            data={data}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ className: 'rounded-md' }}
            loading={loading}
            pagingData={{
                total: tableData.totalPages as number,
                pageIndex: tableData.page as number,
                pageSize: tableData.size as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
        />
    )
}

export default ReviewTable