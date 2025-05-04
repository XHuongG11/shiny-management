import { ApiResponse } from '@/@types/auth'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { Button } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { apiGetCategories, apiGetCollections } from '@/services/SalesService'
import {
    Field,
    FieldArray,
    FieldProps,
    FormikErrors,
    FormikTouched,
} from 'formik'
import { useEffect, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import CreatableSelect from 'react-select/creatable'
import { FiTrash } from 'react-icons/fi'
import { Category, Collection } from '@/@types/product'

type FormFieldsName = {
    category: Category
    collection: Collection
    attributes: {
        name: string
        value: string
    }
}

type OrganizationFieldsProps = {
    type: 'edit' | 'new' | 'view'
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: {
        category: Category
        collection: Collection
        attributes: {
            name: string
            value: string
        }[]
        [key: string]: unknown
    }
}

const OrganizationFields = (props: OrganizationFieldsProps) => {
    const { type, values, touched, errors } = props
    const [categories, setCategories] = useState<Category[]>([])
    const [collections, setCollections] = useState<Collection[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true)
            try {
                const categoryResp =
                    await apiGetCategories<ApiResponse<Category[]>>()
                console.log(categoryResp.data)
                if (categoryResp) {
                    setCategories(
                        categoryResp.data.data.map((item) => ({
                            id: item.id,
                            name: item.name,
                            parent: item.parent,
                        })),
                    )
                }
                const collectionResp =
                    await apiGetCollections<ApiResponse<Collection[]>>()
                console.log(collectionResp.data)
                if (collectionResp) {
                    setCollections(
                        collectionResp.data.data.map((item) => ({
                            id: item.id,
                            name: item.name,
                            description: item.description,
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
        console.log('type', type)
    }, [])

    return (
        <AdaptableCard divider isLastChild className="mb-4">
            <h5>Category & Collection</h5>
            <p className="mb-6"></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <FormItem
                        label="Category"
                        invalid={
                            (errors.category &&
                                touched.category) as unknown as boolean
                        }
                        errorMessage={errors.category?.id as string}
                    >
                        <Field name="category">
                            {({ field, form }: FieldProps) => {
                                const selectedOption = field.value
                                return (
                                    <Select
                                        componentAs={CreatableSelect}
                                        field={field}
                                        form={form}
                                        options={categories.map((category) => ({
                                            label: category.name,
                                            value: category,
                                        }))}
                                        value={
                                            selectedOption?.id
                                                ? {
                                                      label: selectedOption.name,
                                                      value: selectedOption,
                                                  }
                                                : null
                                        }
                                        onChange={(option) =>
                                            form.setFieldValue(field.name, {
                                                id: option?.value?.id,
                                                name: option?.value?.name,
                                            })
                                        }
                                        placeholder="Category"
                                        isLoading={loading}
                                        isDisabled={type === 'view'}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                <div className="col-span-1">
                    <FormItem
                        label="Collection"
                        invalid={
                            (errors.collection &&
                                touched.collection) as unknown as boolean
                        }
                        errorMessage={errors.collection as string}
                    >
                        <Field name="collection">
                            {({ field, form }: FieldProps) => {
                                const selectedOption = field.value
                                return (
                                    <Select
                                        // isMulti // chọn nhiều option
                                        componentAs={CreatableSelect}
                                        field={field}
                                        form={form}
                                        options={collections.map(
                                            (collection) => ({
                                                label: collection.name,
                                                value: collection,
                                            }),
                                        )}
                                        value={
                                            selectedOption
                                                ? {
                                                      label: selectedOption.name,
                                                      value: selectedOption,
                                                  }
                                                : null
                                        }
                                        onChange={(option) =>
                                            form.setFieldValue(
                                                field.name,
                                                option?.value,
                                            )
                                        }
                                        placeholder="Collection"
                                        isDisabled={type === 'view'}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
            </div>

            <h5>Attributes</h5>
            <p className="mb-6"></p>
            <FieldArray name="attributes">
                {({ push, remove }) => (
                    <>
                        {values.attributes.map((_, index) => (
                            <div key={index}>
                                {type === 'view' ? (
                                    <div className="grid gap-4">
                                        <div>
                                            <ul className="mb-6 list-disc list-inside">
                                                <li className="ml-6">
                                                    {
                                                        values.attributes[index]
                                                            .name
                                                    }{' '}
                                                    :{' '}
                                                    {
                                                        values.attributes[index]
                                                            .value
                                                    }
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="mb-6">
                                            Attribute {index + 1}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="col-span-1">
                                                <FormItem
                                                    label="Name"
                                                    invalid={
                                                        (errors.attributes
                                                            ?.name &&
                                                            touched.attributes
                                                                ?.name) as boolean
                                                    }
                                                    errorMessage={
                                                        errors.attributes?.name
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name={`attributes[${index}].name`}
                                                        placeholder="Name"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>
                                            <div className="col-span-1">
                                                <FormItem
                                                    label="Value"
                                                    invalid={
                                                        (errors.attributes
                                                            ?.value &&
                                                            touched.attributes
                                                                ?.value) as boolean
                                                    }
                                                    errorMessage={
                                                        errors.attributes?.value
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name={`attributes[${index}].value`}
                                                        placeholder="Value"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>
                                            {values.attributes.length > 1 && (
                                                <div className="col-span-1 flex items-center">
                                                    <Button
                                                        size="sm"
                                                        variant="solid"
                                                        color="orange-500"
                                                        icon={<FiTrash />}
                                                        type="button"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                    ></Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {type !== 'view' && (
                            <div className="col-span-1">
                                <Button
                                    size="sm"
                                    variant="solid"
                                    color="green-500"
                                    icon={<IoIosAddCircle />}
                                    type="button"
                                    onClick={() =>
                                        push({
                                            name: '',
                                            value: '',
                                        })
                                    }
                                ></Button>
                            </div>
                        )}
                    </>
                )}
            </FieldArray>
        </AdaptableCard>
    )
}

export default OrganizationFields
