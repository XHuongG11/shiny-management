import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { useAppSelector } from '../store'
import { Category } from '@/@types/product'

type FormFieldsName = {
    id?: number
    name: string
    parent: Category | null
}

type CategoryFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const CategoryFields = (props: CategoryFieldsProps) => {
    const { touched, errors } = props
    const categories = useAppSelector(
        (state) => state.salesCatalog?.categories?.data?.categories,
    )

    return (
        <AdaptableCard divider className="mb-4">
            <FormItem
                label="Name"
                invalid={(errors.name && touched.name) as boolean}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Name"
                    component={Input}
                />
            </FormItem>
            <FormItem label="Parent Category">
                <Field name="parent">
                    {({ field, form }: FieldProps<FormFieldsName>) => (
                        <Select
                            field={field}
                            form={form}
                            options={categories}
                            getOptionLabel={(option: Category) => option.name}
                            getOptionValue={(option: Category) =>
                                String(option.id)
                            }
                            value={
                                categories.find(
                                    (c) => c.id === field.value?.id,
                                ) || null
                            }
                            onChange={(option) =>
                                form.setFieldValue(field.name, option)
                            }
                        />
                    )}
                </Field>
            </FormItem>
        </AdaptableCard>
    )
}

export default CategoryFields
