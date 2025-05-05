import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Formik, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import { 
    FormContainer, 
    FormItem 
} from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
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
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import AdaptableCard from '@/components/shared/AdaptableCard'
import dayjs from 'dayjs'
import { 
    Voucher, 
    VoucherApplicability, 
    VoucherType 
} from '@/@types/voucher'
import debounce from 'lodash/debounce'

type VoucherFormProps = {
    data?: Voucher
    isEdit: boolean
    onUpdate?: (data: Voucher) => void
}

type ApplicabilityOption = {
    value: string | number
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
        is: (applicabilityType: string, type: string) => {
            return applicabilityType !== 'ALL' && type === 'PROMOTION';
        },
        then: (schema) => schema.min(1, 'Please select at least one item'),
        otherwise: (schema) => schema.optional(),
    }),
})

const defaultInitialValues = {
    code: '',
    name: '',
    discountRate: 0,
    minimumToApply: 0,
    applyLimit: 0,
    validFrom: dayjs().toDate(),
    validTo: dayjs().add(30, 'day').toDate(),
    quantity: 100,
    limitUsePerCustomer: 1,
    type: 'PROMOTION',
    applicabilityType: 'ALL',
    selectedApplicabilities: [],
}

const VoucherForm = ({ data, isEdit }: VoucherFormProps) => {
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState(false)
    const [applicableObjects, setApplicableObjects] = useState<ApplicabilityOption[]>([])

    useEffect(() => {
        if (isEdit && data) {
            const applicabilityType = getApplicabilityType(data.applicabilities)
            fetchApplicableObjects(applicabilityType, '')
        }
    }, [isEdit, data])
    
    const fetchApplicableObjects = async (applicabilityType: string, searchTerm: string = '') => {
        if (applicabilityType === 'ALL') {
            setApplicableObjects([])
            return
        }

        try {
            let response: any
            
            switch (applicabilityType) {
                case 'PRODUCT':
                    response = await apiGetProducts(searchTerm || '')
                    if (response.data && response.data.data) {
                        setApplicableObjects(response.data.data.content.map((p: any) => ({ 
                            value: p.id, 
                            label: p.title || p.name
                        })))
                    }
                    break
                    
                case 'CATEGORY':
                    response = await apiGetCategories(searchTerm || '')
                    if (response.data && response.data.data) {
                        setApplicableObjects(response.data.data.map((c: any) => ({ 
                            value: c.id, 
                            label: c.name 
                        })))
                    }
                    break
                    
                case 'COLLECTION':
                    response = await apiGetCollections(searchTerm || '')
                    if (response.data && response.data.data) {
                        setApplicableObjects(response.data.data.map((c: any) => ({ 
                            value: c.id, 
                            label: c.name 
                        })))
                    }
                    break
                    
                case 'CUSTOMER':
                    response = await apiGetCustomers(searchTerm || '')
                    if (response.data && response.data.data) {
                        setApplicableObjects(response.data.data.content.map((c: any) => ({ 
                            value: c.id, 
                            label: c.fullName || c.username
                        })))
                    }
                    break
                    
                default:
                    setApplicableObjects([])
            }
        } catch (error) {
            console.error('Error fetching applicable objects:', error)
            setApplicableObjects([])
        }
    }

    const debouncedSearch = debounce((applicabilityType, searchTerm) => {
        fetchApplicableObjects(applicabilityType, searchTerm)
    }, 300)

    const handleApplicabilitySearch = (applicabilityType: string, searchTerm: string) => {
        debouncedSearch(applicabilityType, searchTerm)
    }

    const getApplicabilityType = (applicabilities?: VoucherApplicability[]): string => {
        if (!applicabilities || applicabilities.length === 0) {
            return 'ALL'
        }
        
        return applicabilities[0].type
    }
    
    const getSelectedApplicabilities = (
        applicabilityType: string,
        applicabilities?: VoucherApplicability[]
    ): number[] => {
        if (!applicabilities || applicabilityType === 'ALL') {
            return []
        }
        
        return applicabilities
            .filter(app => app.applicableObjectId !== null)
            .map(app => app.applicableObjectId as number)
    }

    const initialValues = isEdit && data ? {
        code: data.code || '',
        name: data.name || '',
        discountRate: data.discountRate || 0,
        minimumToApply: data.minimumToApply || 0,
        applyLimit: data.applyLimit || 0,
        validFrom: data.validFrom ? dayjs(data.validFrom).toDate() : dayjs().toDate(),
        validTo: data.validTo ? dayjs(data.validTo).toDate() : dayjs().add(30, 'day').toDate(),
        quantity: data.quantity || 100,
        limitUsePerCustomer: data.limitUsePerCustomer || 1,
        type: data.type || 'PROMOTION',
        applicabilityType: getApplicabilityType(data.applicabilities),
        selectedApplicabilities: getSelectedApplicabilities(
            getApplicabilityType(data.applicabilities),
            data.applicabilities
        ),
    } : defaultInitialValues

    const handleFormSubmit = async (values: typeof defaultInitialValues) => {
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
            
            let response;
            if (isEdit && data?.id) {
                response = await apiUpdateVoucher(data.id, voucherData)
            } else {
                response = await apiAddVoucher(voucherData)
            }
            
            // Check response code
            if (response.data && response.data.code === "200") {
                toast.push(
                    <Notification title="Success" type="success">
                        {isEdit ? 'Voucher updated successfully' : 'Voucher created successfully'}
                    </Notification>
                )

                navigate(`${APP_PREFIX_PATH}/vouchers`)
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {response.data?.message || 'Failed to save voucher'}
                    </Notification>
                )
            }
        } catch (error: any) {
            const errorResponse = error.response?.data
            let errorMessage = 'Failed to save voucher'
            
            if (errorResponse) {
                switch (errorResponse.code) {
                    case "400":
                        errorMessage = errorResponse.message || 'Invalid voucher data'
                        break
                    case "409":
                        errorMessage = errorResponse.message || 'Voucher code already exists'
                        break
                    case "1000":
                        errorMessage = errorResponse.message || 'System error occurred'
                        break
                    default:
                        errorMessage = errorResponse.message || 'An error occurred'
                }
            }
            
            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleCancel = () => {
        navigate(`${APP_PREFIX_PATH}/vouchers`)
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
                            options={applicableObjects}
                            value={applicableObjects.filter(
                                option => field.value?.includes(option.value)
                            )}
                            onChange={(selections) => {
                                form.setFieldValue(
                                    field.name,
                                    selections?.map(option => option.value) || []
                                )
                            }}
                            onInputChange={(value) => {
                                handleApplicabilitySearch(applicabilityType, value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        )
    }

    return (
        <AdaptableCard>
            <div>
                <Formik
                    initialValues={initialValues as typeof defaultInitialValues} 
                    validationSchema={voucherValidationSchema}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {({ values, touched, errors }) => (
                        <Form>
                            <FormContainer>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <AdaptableCard divider className="mb-4">
                                            <h5>Basic Information</h5>
                                            <p className="mb-6">Section to configure basic voucher information</p>
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
                                        </AdaptableCard>
                                        <AdaptableCard divider className="mb-4">
                                            <h5>Voucher Value</h5>
                                            <p className="mb-6">Section to configure the voucher values</p>
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
                                        </AdaptableCard>
                                    </div>
                                    <div>
                                        <AdaptableCard divider className="mb-4">
                                            <h5>Validity & Usage</h5>
                                            <p className="mb-6">Section to configure voucher validity and usage</p>
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
                                        </AdaptableCard>
                                        {values.type === 'PROMOTION' && (
                                            <AdaptableCard divider>
                                                <h5>Applicability</h5>
                                                <p className="mb-6">Section to configure voucher applicability</p>
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
                                                                    const newType = option?.value || 'ALL'
                                                                    form.setFieldValue(field.name, newType)
                                                                    // Clear previous selections when changing applicability type
                                                                    form.setFieldValue('selectedApplicabilities', [])
                                                                    // Fetch applicable objects for the selected type
                                                                    fetchApplicableObjects(newType as string, '')
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
                                            </AdaptableCard>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        variant="plain"
                                        onClick={handleCancel}
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
                                        {isEdit ? 'Save' : 'Create'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </AdaptableCard>
    )
}

export default VoucherForm