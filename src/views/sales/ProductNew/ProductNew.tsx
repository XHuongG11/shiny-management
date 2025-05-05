import ProductForm, {
    FormModel,
    SetSubmitting,
} from '@/views/sales/ProductForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiAddProductImage, apiCreateProduct } from '@/services/SalesService'
import { ProductResponse } from '@/@types/product'
import { ApiResponse } from '@/@types/auth'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

const ProductNew = () => {
    const navigate = useNavigate()

    const addProduct = async (data: FormModel) => {
        const cleanData = { ...data }

        ;(Object.keys(cleanData) as (keyof typeof cleanData)[]).forEach(
            (key) => {
                const value = cleanData[key]
                if (
                    value == null ||
                    (Array.isArray(value) && value.length === 0) ||
                    (typeof value === 'object' &&
                        !Array.isArray(value) &&
                        Object.keys(value).length === 0)
                ) {
                    delete cleanData[key]
                }
            },
        )
        // thêm product
        const response = await apiCreateProduct<
            ApiResponse<ProductResponse>,
            FormModel
        >(cleanData)
        // thêm image
        if (response.data.code === '200') {
            if (data.images?.length !== 0) {
                const productId = response.data.data.id
                const formData = new FormData()
                formData.append('productId', String(productId))
                data.images
                    ?.map((i) => i.file)
                    .forEach((file) => {
                        if (file) {
                            formData.append('files', file)
                        }
                    })
                const responseImage = await apiAddProductImage(formData)
                console.log('img data', responseImage.data)
            }
            return response.data
        } else if (response.data.code === '409') {
            toast.push(
                <Notification
                    title={'Product title already exists please check again!'}
                    type="danger"
                    duration={2500}
                >
                    Product title already exists please check again!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            return false
        }
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting,
    ) => {
        setSubmitting(true)
        const success = await addProduct(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Product successfuly added
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate(`${APP_PREFIX_PATH}/products`)
        }
    }

    const handleDiscard = () => {
        navigate(`${APP_PREFIX_PATH}/products`)
    }

    return (
        <>
            <ProductForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default ProductNew
