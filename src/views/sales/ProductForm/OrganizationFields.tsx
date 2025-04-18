import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import CreatableSelect from 'react-select/creatable'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { apiGetCategories } from '@/services/SalesService'
import { useEffect, useState } from 'react'
import { ApiResponse } from '@/@types/auth'

type Options = {
    label: string
    value: string
}[]

type FormFieldsName = {
    category: string
    collection: Options
    vendor: string
    brand: string
}

type OrganizationFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: {
        category: string
        collection: Options
        [key: string]: unknown
    }
}
type Category = {
    id: string
    name: string
}

const collection = [
    { label: 'trend', value: 'trend' },
    { label: 'unisex', value: 'unisex' },
]

const OrganizationFields = (props: OrganizationFieldsProps) => {
    const { values = { category: '', collection: [] }, touched, errors } = props
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                const response =
                    await apiGetCategories<ApiResponse<Category[]>>()
                console.log(response.data)
                if (response) {
                    setCategories(
                        response.data.data.map((item) => ({
                            id: item.id,
                            name: item.name,
                        })),
                    )
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    return (
        <AdaptableCard divider isLastChild className="mb-4">
            <h5>Organizations</h5>
            <p className="mb-6">Section to config the product attribute</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Category"
                        invalid={
                            (errors.category && touched.category) as boolean
                        }
                        errorMessage={errors.category}
                    >
                        <Field name="category">
                            {({ field, form }: FieldProps) => {
                                const selectedOption = categories.find(
                                    (category) => category.id === field.value,
                                )

                                return (
                                    <Select
                                        options={categories.map((category) => ({
                                            label: category.name,
                                            value: category.id,
                                        }))}
                                        value={
                                            selectedOption
                                                ? {
                                                      label: selectedOption.name,
                                                      value: selectedOption.id,
                                                  }
                                                : null
                                        }
                                        onChange={(option) =>
                                            form.setFieldValue(
                                                field.name,
                                                option?.value,
                                            )
                                        }
                                        isLoading={loading}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="collection"
                        invalid={
                            (errors.collection &&
                                touched.collection) as unknown as boolean
                        }
                        errorMessage={errors.collection as string}
                    >
                        <Field name="collection">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    isMulti
                                    componentAs={CreatableSelect}
                                    field={field}
                                    form={form}
                                    options={collection}
                                    value={values.collection}
                                    onChange={(option) =>
                                        form.setFieldValue(field.name, option)
                                    }
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Brand"
                        invalid={(errors.brand && touched.brand) as boolean}
                        errorMessage={errors.brand}
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="brand"
                            placeholder="Brand"
                            component={Input}
                        />
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Vendor"
                        invalid={(errors.vendor && touched.vendor) as boolean}
                        errorMessage={errors.vendor}
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="vendor"
                            placeholder="Vendor"
                            component={Input}
                        />
                    </FormItem>
                </div>
            </div>
        </AdaptableCard>
    )
}

export default OrganizationFields
