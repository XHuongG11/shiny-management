import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import Loading from '@/components/shared/Loading'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { injectReducer } from '@/store'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import reducer, {
    deleteProduct,
    getProduct,
    updateProduct,
    useAppDispatch,
    useAppSelector,
} from './store'

import { apiAddProductImage } from '@/services/SalesService'
import ProductForm, {
    FormModel,
    OnDeleteCallback,
    SetSubmitting,
} from '@/views/sales/ProductForm'
import isEmpty from 'lodash/isEmpty'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

injectReducer('salesProductEdit', reducer)

const ProductDetail = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const productData = useAppSelector(
        (state) => state.salesProductEdit.data.productData,
    )
    const loading = useAppSelector(
        (state) => state.salesProductEdit.data.loading,
    )

    const fetchData = (data: number) => {
        dispatch(getProduct(data))
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting,
    ) => {
        setSubmitting(true)
        const productid = values.id
        if (productid !== undefined) {
            const success = await updateProduct(productid, values)
            // update images
            if (values.images?.length !== 0) {
                values.images?.forEach(async (i) => {
                    const formData = new FormData()
                    formData.append('files', i?.file || '')
                    if (i.id === null) {
                        formData.append('productId', String(productid) || '')
                        const responseImage = await apiAddProductImage(formData)
                        console.log('img data', responseImage.data)
                    }
                    // } else {
                    //     const responseImage = await apiUpdateProductImage(
                    //         i?.id,
                    //         formData,
                    //     )
                    //     console.log('img data', responseImage.data)
                    // }
                })
            }
            setSubmitting(false)
            if (success) {
                popNotification('updated')
            }
        } else {
            popNotificationFailed('updated')
        }
    }

    const handleDiscard = () => {
        navigate(`${APP_PREFIX_PATH}/products`)
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        if (productData?.id !== undefined) {
            const success = await deleteProduct(productData.id)
            if (success) {
                popNotification('deleted')
            }
        } else {
            popNotificationFailed('deleted')
        }
    }
    const popNotificationFailed = (keyword: string) => {
        toast.push(
            <Notification
                title={`Fail ${keyword}`}
                type="danger"
                duration={2500}
            >
                Failed to delete product.
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }
    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Product successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
        navigate(`${APP_PREFIX_PATH}/products`)
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1,
        )
        const id = Number(path)
        if (isNaN(id)) {
            console.error('Invalid ID')
            return
        }
        fetchData(id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <>
            <Loading loading={loading}>
                {!isEmpty(productData) && (
                    <>
                        <ProductForm
                            type="view"
                            initialData={productData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(productData) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3 className="mt-8">No product found!</h3>
                </div>
            )}
        </>
    )
}

export default ProductDetail
