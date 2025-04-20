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

const ProductNew = () => {
    const navigate = useNavigate()

    const addProduct = async (data: FormModel) => {
        // thêm product
        const response = await apiCreateProduct<
            ApiResponse<ProductResponse>,
            FormModel
        >(data)
        // thêm image
        const productId = response.data.data.id
        const formData = new FormData()
        formData.append('productId', String(productId))

        data.imgList
            ?.map((i) => i.file)
            .forEach((file) => {
                formData.append('files', file) // append nhiều file với key "files"
            })
        const responseImage = await apiAddProductImage(formData)
        console.log(responseImage.data)
        return response.data
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
            navigate('/app/sales/product-list')
        }
    }

    const handleDiscard = () => {
        navigate('/app/sales/product-list')
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
