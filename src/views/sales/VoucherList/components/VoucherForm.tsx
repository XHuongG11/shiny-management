import { useState, useEffect } from 'react'
import { Form, Formik, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import { 
    FormContainer, 
    FormItem 
} from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import DateTimepicker from '@/components/ui/DatePicker'
import { 
    apiAddVoucher, 
    apiUpdateVoucher, 
    apiGetProducts, 
    apiGetCategories, 
    apiGetCollections, 
    apiGetCustomers 
} from '@/services/VoucherService'
import { getVouchers, useAppDispatch, useAppSelector } from '../store'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import dayjs from 'dayjs'
import { 
    Voucher, 
    VoucherApplicability, 
    VoucherType 
} from '@/@types/voucher'

type VoucherFormProps = {
    open: boolean
    onClose: () => void
    editMode: boolean
}

type ProductOption = {
    value: number
    label: string
}

type ApplicabilityOption = {
    value: string
    label: string
}

const applicabilityOptions: ApplicabilityOption[] = [
    { value: 'ALL', label: 'All' },
    { value: 'PRODUCT', label: 'Products' },
    { value: 'CATEGORY', label: 'Categories' },
    { value: 'COLLECTION', label: 'Collections' },
    { value: 'CUSTOMER', label: 'Customers' },
]

const voucherTypeOptions = [
    { value: 'PROMOTION', label: 'Promotion' },
    { value: 'FREESHIP', label: 'Free Shipping' },
]

const voucherValidationSchema = Yup.object().shape({
    code: Yup.string().required('Voucher code is required'),
    name: Yup.string().required('Voucher name is required'),
    discountRate: Yup.number()
        .required('Discount rate is required')
        .min(0, 'Discount rate cannot be negative')
        .max(100, 'Discount rate cannot exceed 100%'),
    minimumToApply: Yup.number()
        .required('Minimum purchase amount is required')
        .min(0, 'Amount cannot be negative'),
    applyLimit: Yup.number()
        .required('Apply limit is required')
        .min(0, 'Limit cannot be negative'),
    validFrom: Yup.date().required('Start date is required'),
    validTo: Yup.date()
        .required('End date is required')
        .min(Yup.ref('validFrom'), 'End date must be after start date'),
    quantity: Yup.number()
        .required('Quantity is required')
        .min(1, 'Quantity must be at least 1')
        .integer('Quantity must be a whole number'),
    limitUsePerCustomer: Yup.number()
        .required('Usage limit per customer is required')
        .min(1, 'Limit must be at least 1')
        .integer('Limit must be a whole number'),
    type: Yup.string().required('Voucher type is required'),
    applicabilityType: Yup.string().required('Application scope is required'),
    selectedApplicabilities: Yup.array().when(['applicabilityType', 'type'], {
        is: (applicabilityType : string, type : string) => {
            return applicabilityType !== 'ALL' && type === 'PROMOTION';
        },
        then: (schema) => schema.min(1, 'Please select at least one item'),
        otherwise: (schema) => schema.optional(),
    }),
})

const VoucherForm = ({ open, onClose, editMode }: VoucherFormProps) => {
    const dispatch = useAppDispatch()

    const selectedVoucher = useAppSelector(
        (state) => state.salesVoucherList.data.selectedVoucher
    )

    const [products, setProducts] = useState<ProductOption[]>([])
    const [categories, setCategories] = useState<ProductOption[]>([])
    const [collections, setCollections] = useState<ProductOption[]>([])
    const [customers, setCustomers] = useState<ProductOption[]>([])
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (open) {
            fetchSelectionOptions()
        }
    }, [open])
    
    const fetchSelectionOptions = async () => {
        try {
            const [productsRes, categoriesRes, collectionsRes, customersRes] = await Promise.all([
                apiGetProducts<any>(),
                apiGetCategories<any>(),
                apiGetCollections<any>(),
                apiGetCustomers<any>(),
            ])
            
            // Assuming appropriate response formats, adjust as needed
            if (productsRes.data && productsRes.data.data) {
                setProducts(productsRes.data.data.content.map((p: any) => ({ 
                    value: p.id, 
                    label: p.title 
                })))
            }
            
            if (categoriesRes.data) {
                setCategories(categoriesRes.data.map((c: any) => ({ 
                    value: c.id, 
                    label: c.name 
                })))
            }
            
            if (collectionsRes.data) {
                setCollections(collectionsRes.data.map((c: any) => ({ 
                    value: c.id, 
                    label: c.name 
                })))
            }
            
            if (customersRes.data && customersRes.data.data) {
                setCustomers(customersRes.data.data.content.map((c: any) => ({ 
                    value: c.id, 
                    label: c.fullName 
                })))
            }
        } catch (error) {
            console.error('Error fetching options:', error)
        }
    }

    const getApplicabilityType = (applicabilities: VoucherApplicability[] | undefined): string => {
        if (!applicabilities || applicabilities.length === 0) {
            return 'ALL'
        }
        
        return applicabilities[0].type
    }
    
    const getSelectedApplicabilities = (
        applicabilityType: string,
        applicabilities: VoucherApplicability[] | undefined
    ): number[] => {
        if (!applicabilities || applicabilityType === 'ALL') {
            return []
        }
        
        return applicabilities
            .filter(app => app.applicableObjectId !== null)
            .map(app => app.applicableObjectId as number)
    }

    const initialValues = {
        code: selectedVoucher?.code || '',
        name: selectedVoucher?.name || '',
        discountRate: selectedVoucher?.discountRate || 0,
        minimumToApply: selectedVoucher?.minimumToApply || 0,
        applyLimit: selectedVoucher?.applyLimit || 0,
        validFrom: selectedVoucher?.validFrom 
            ? dayjs(selectedVoucher.validFrom).toDate() 
            : dayjs().toDate(),
        validTo: selectedVoucher?.validTo 
            ? dayjs(selectedVoucher.validTo).toDate() 
            : dayjs().add(30, 'day').toDate(),
        quantity: selectedVoucher?.quantity || 100,
        limitUsePerCustomer: selectedVoucher?.limitUsePerCustomer || 1,
        type: selectedVoucher?.type || 'PROMOTION',
        applicabilityType: getApplicabilityType(selectedVoucher?.applicabilities),
        selectedApplicabilities: getSelectedApplicabilities(
            getApplicabilityType(selectedVoucher?.applicabilities),
            selectedVoucher?.applicabilities
        ),
    }

    const handleFormSubmit = async (values: typeof initialValues) => {
        setSubmitting(true)
        
        try {
            const voucherData: Voucher = {
                code: values.code,
                name: values.name,
                discountRate: values.discountRate,
                minimumToApply: values.minimumToApply,
                applyLimit: values.applyLimit,
                validFrom: dayjs(values.validFrom).format('YYYY-MM-DDTHH:mm:ss'),
                validTo: dayjs(values.validTo).format('YYYY-MM-DDTHH:mm:ss'),
                quantity: values.quantity,
                limitUsePerCustomer: values.limitUsePerCustomer,
                type: values.type as VoucherType,
                applicabilities: []
            }
            
            // Handle applicabilities based on type and applicability type
            if (values.type === 'FREESHIP' || values.applicabilityType === 'ALL') {
                voucherData.applicabilities = [{ type: 'ALL', applicableObjectId: null }]
            } else {
                voucherData.applicabilities = values.selectedApplicabilities.map(id => ({
                    type: values.applicabilityType as any,
                    applicableObjectId: id
                }))
            }
            
            if (editMode && selectedVoucher?.id) {
                await apiUpdateVoucher(selectedVoucher.id, voucherData)
                toast.push(
                    <Notification title="Success" type="success">
                        Voucher updated successfully
                    </Notification>
                )
            } else {
                await apiAddVoucher(voucherData)
                toast.push(
                    <Notification title="Success" type="success">
                        Voucher created successfully
                    </Notification>
                )
            }
            
            // Refresh voucher list
            dispatch(getVouchers({ page: 1, size: 10 }))
            onClose()
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error?.response?.data?.message || 'Failed to save voucher'}
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    const getApplicabilityOptions = (applicabilityType: string) => {
        switch (applicabilityType) {
            case 'PRODUCT':
                return products
            case 'CATEGORY':
                return categories
            case 'COLLECTION':
                return collections
            case 'CUSTOMER':
                return customers
            default:
                return []
        }
    }

    const renderApplicabilitySelector = (
        applicabilityType: string,
        values: any,
        touched: any,
        errors: any
    ) => {
        if (values.type === 'FREESHIP' || applicabilityType === 'ALL') {
            return null
        }
        
        const options = getApplicabilityOptions(applicabilityType)
        
        return (
            <FormItem
                label={`Select ${applicabilityType.toLowerCase()}s`}
                invalid={
                    errors.selectedApplicabilities &&
                    touched.selectedApplicabilities
                }
                errorMessage={errors.selectedApplicabilities}
            >
                <Field name="selectedApplicabilities">
                    {({ field, form }: FieldProps) => (
                        <Select
                            placeholder={`Select ${applicabilityType.toLowerCase()}s...`}
                            isMulti
                            field={field}
                            form={form}
                            options={options}
                            value={options.filter(
                                option => field.value?.includes(option.value)
                            )}
                            onChange={(selections) => {
                                form.setFieldValue(
                                    field.name,
                                    selections?.map(option => option.value) || []
                                )
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        )
    }

    return (
        <Dialog
            isOpen={open}
            onClose={onClose}
            onRequestClose={onClose}
            width={700}
        >
            <h4>{editMode ? 'Edit Voucher' : 'Add New Voucher'}</h4>
            <div className="mt-4">
                <Formik
                    initialValues={initialValues}
                    validationSchema={voucherValidationSchema}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {({ values, touched, errors, setFieldValue }) => (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Voucher Code"
                                    invalid={errors.code && touched.code}
                                    errorMessage={errors.code}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="code"
                                        placeholder="Enter voucher code"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Voucher Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Enter voucher name"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Voucher Type"
                                    invalid={errors.type && touched.type}
                                    errorMessage={errors.type}
                                >
                                    <Field name="type">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                placeholder="Select voucher type"
                                                field={field}
                                                form={form}
                                                options={voucherTypeOptions}
                                                value={voucherTypeOptions.filter(
                                                    option => option.value === values.type
                                                )}
                                                onChange={(option) => {
                                                    form.setFieldValue(field.name, option?.value)
                                                    // If changing to FREESHIP, set applicability to ALL
                                                    if (option?.value === 'FREESHIP') {
                                                        form.setFieldValue('applicabilityType', 'ALL')
                                                        form.setFieldValue('selectedApplicabilities', [])
                                                    }
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label="Discount Rate (%)"
                                    invalid={errors.discountRate && touched.discountRate}
                                    errorMessage={errors.discountRate}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="discountRate"
                                        placeholder="Enter discount rate"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Minimum Purchase Amount (VNĐ)"
                                    invalid={errors.minimumToApply && touched.minimumToApply}
                                    errorMessage={errors.minimumToApply}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="minimumToApply"
                                        placeholder="Enter minimum purchase amount"
                                        component={Input}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Maximum Discount Amount (VNĐ)"
                                    invalid={errors.applyLimit && touched.applyLimit}
                                    errorMessage={errors.applyLimit}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="applyLimit"
                                        placeholder="Enter maximum discount amount"
                                        component={Input}
                                    />
                                </FormItem>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem
                                        label="Valid From"
                                        invalid={(errors.validFrom && touched.validFrom) as boolean}
                                        errorMessage={errors.validFrom as string}
                                    >
                                        <Field name="validFrom">
                                            {({ field, form }: FieldProps) => (
                                                <DateTimepicker
                                                    field={field}
                                                    form={form}
                                                    value={values.validFrom}
                                                    onChange={(date) => {
                                                        form.setFieldValue(field.name, date)
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    <FormItem
                                        label="Valid To"
                                        invalid={(errors.validTo && touched.validTo) as boolean}
                                        errorMessage={errors.validTo as string}
                                    >
                                        <Field name="validTo">
                                            {({ field, form }: FieldProps) => (
                                                <DateTimepicker
                                                    field={field}
                                                    form={form}
                                                    value={values.validTo}
                                                    onChange={(date) => {
                                                        form.setFieldValue(field.name, date)
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem
                                        label="Total Quantity"
                                        invalid={errors.quantity && touched.quantity}
                                        errorMessage={errors.quantity}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name="quantity"
                                            placeholder="Enter quantity"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Limit Use Per Customer"
                                        invalid={
                                            errors.limitUsePerCustomer && touched.limitUsePerCustomer
                                        }
                                        errorMessage={errors.limitUsePerCustomer}
                                    >
                                        <Field
                                            type="number"
                                            autoComplete="off"
                                            name="limitUsePerCustomer"
                                            placeholder="Enter usage limit per customer"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>
                                {values.type === 'PROMOTION' && (
                                    <>
                                        <FormItem
                                            label="Application Scope"
                                            invalid={errors.applicabilityType && touched.applicabilityType}
                                            errorMessage={errors.applicabilityType}
                                        >
                                            <Field name="applicabilityType">
                                                {({ field, form }: FieldProps) => (
                                                    <Select
                                                        placeholder="Select application scope"
                                                        field={field}
                                                        form={form}
                                                        options={applicabilityOptions}
                                                        value={applicabilityOptions.filter(
                                                            option => option.value === values.applicabilityType
                                                        )}
                                                        onChange={(option) => {
                                                            form.setFieldValue(field.name, option?.value)
                                                            // Clear previous selections when changing applicability type
                                                            form.setFieldValue('selectedApplicabilities', [])
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        {renderApplicabilitySelector(
                                            values.applicabilityType,
                                            values,
                                            touched,
                                            errors
                                        )}
                                    </>
                                )}
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        variant="plain"
                                        onClick={onClose}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="solid"
                                        loading={submitting}
                                        disabled={submitting}
                                    >
                                        {editMode ? 'Save Voucher' : 'Create Voucher'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </Dialog>
    )
}

export default VoucherForm