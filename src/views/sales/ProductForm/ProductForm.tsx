import { ProductRequest, ProductResponse } from '@/@types/product'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import StickyFooter from '@/components/shared/StickyFooter'
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import { Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { forwardRef, useState } from 'react'
import { AiOutlineSave } from 'react-icons/ai'
import { HiOutlineTrash } from 'react-icons/hi'
import * as Yup from 'yup'
import BasicInformationFields from './BasicInformationFields'
import OrganizationFields from './OrganizationFields'
import ProductImages from './ProductImages'
import SizeFields from './SizeFields'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

export type FormModel = Omit<ProductRequest, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type ProductForm = {
    initialData?: ProductRequest | ProductResponse
    type: 'edit' | 'new' | 'view'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const getValidationSchema = () => {
    return Yup.object().shape({
        title: Yup.string().required('Product name Required'),
        category: Yup.object()
            .shape({
                id: Yup.string().required('Category is required'),
                name: Yup.string().required(),
            })
            .nullable()
            .required('Category is required'),
        collection: Yup.object()
            .shape({
                id: Yup.number(),
                name: Yup.string(),
            })
            .notRequired(),
        productSizes: Yup.array()
            .of(
                Yup.object().shape({
                    size: Yup.string()
                        .required('Size is required'),
                    stock: Yup.number()
                        .typeError('Stock must be a number')
                        .required('Stock is required'),
                    price: Yup.number()
                        .typeError('Price must be a number')
                        .required('Price is required'),
                    discountPrice: Yup.number()
                        .typeError('Discount price must be a number')
                        .required('Discount price is required'),
                    discountRate: Yup.number()
                        .typeError('Discount rate must be a number')
                        .required('Discount rate is required')
                        .max(100, 'Discount rate cannot exceed 100%'),
                }),
            )
            .min(1, 'At least one product size is required')
            .test('unique-size', 'Sizes must be unique', (productSizes) => {
                if (!productSizes) return true
                const seen = new Set()
                for (const item of productSizes) {
                    if (item?.size == null) continue // Bỏ qua giá trị chưa nhập
                    if (seen.has(item.size)) return false
                    seen.add(item.size)
                }
                return true
            }),
    })
}

const DeleteProductButton = ({ onDelete }: { onDelete: OnDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete?.(setDialogOpen)
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                Delete
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete product"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>Bạn có chắc chắn muốn xóa món sản phẩm này không?</p>
            </ConfirmDialog>
        </>
    )
}

const ProductForm = forwardRef<FormikRef, ProductForm>((props, ref) => {
    const {
        type,
        initialData = {
            title: '',
            material: '',
            images: [],
            description: '',
            category: null,
            collection: null,
            attributes: [],
            productSizes: [
                {
                    size: '',
                    stock: null,
                    price: null,
                    discountPrice: null,
                    discountRate: null,
                },
            ],
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={getValidationSchema()}
                onSubmit={(values: FormModel, { setSubmitting }) => {
                    console.log('onSubmit triggered! values:', values)
                    const formData = cloneDeep(values)
                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <BasicInformationFields
                                        type={type}
                                        touched={touched}
                                        errors={errors}
                                    />
                                    <OrganizationFields
                                        type={type}
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                    />
                                    <SizeFields
                                        type={type}
                                        touched={touched}
                                        errors={errors}
                                        values={values}
                                    />
                                </div>
                                <div className="lg:col-span-1">
                                    <ProductImages
                                        type={type}
                                        values={values}
                                    />
                                </div>
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <DeleteProductButton
                                            onDelete={onDelete as OnDelete}
                                        />
                                    )}
                                </div>
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
                                    >
                                        Discard
                                    </Button>
                                    {type !== 'view' && (
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                    )}
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

ProductForm.displayName = 'ProductForm'

export default ProductForm
