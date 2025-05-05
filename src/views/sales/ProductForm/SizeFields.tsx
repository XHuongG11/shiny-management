import AdaptableCard from '@/components/shared/AdaptableCard'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
    Field,
    FormikErrors,
    FormikTouched,
    FieldProps,
    FieldInputProps,
    FieldArray,
} from 'formik'
import type { ComponentType } from 'react'
import type { InputProps } from '@/components/ui/Input'
import { Button } from '@/components/ui'
import { IoIosAddCircle } from 'react-icons/io'
import { FiTrash } from 'react-icons/fi'

type FormFieldsName = {
    productSizes: {
        size: string
        stock: number
        price: number
        discountPrice: number
        discountRate: number
    }[]
}

type PricingFieldsProps = {
    type: 'edit' | 'new' | 'view'
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: {
        productSizes: {
            size: string
            stock: number
            price: number
            discountPrice: number
            discountRate: number
        }[]
    }
}

const PriceInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} prefix="VND" />
}

const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const TaxRateInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            autoComplete="off"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const SizeFields = (props: PricingFieldsProps) => {
    const { type, values, touched, errors } = props
    return (
        <AdaptableCard divider className="mb-4">
            <h5>Product Size</h5>
            <p className="mb-6">Section to config product size</p>
            <FieldArray name="productSizes">
                {({ remove, push }) => (
                    <>
                        {type === 'view' ? (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        {values.productSizes
                                            .filter(
                                                (_, index) => index % 2 === 0,
                                            )
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border p-4 rounded-md shadow-sm"
                                                >
                                                    <p>
                                                        <strong>
                                                            Product Size:
                                                        </strong>{' '}
                                                        {item.size}
                                                    </p>
                                                    <p>
                                                        <strong>Stock:</strong>{' '}
                                                        {item.stock}
                                                    </p>
                                                    <p>
                                                        <strong>Price:</strong>{' '}
                                                        {item.price} VND
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Discount Price:
                                                        </strong>{' '}
                                                        {item.discountPrice} VND
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Discount Rate:
                                                        </strong>{' '}
                                                        {item.discountRate} %
                                                    </p>
                                                </div>
                                            ))}
                                    </div>

                                    <div className="space-y-6">
                                        {values.productSizes
                                            .filter(
                                                (_, index) => index % 2 !== 0,
                                            )
                                            .map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="border p-4 rounded-md shadow-sm"
                                                >
                                                    <p>
                                                        <strong>
                                                            Product Size:
                                                        </strong>{' '}
                                                        {item.size}
                                                    </p>
                                                    <p>
                                                        <strong>Stock:</strong>{' '}
                                                        {item.stock}
                                                    </p>
                                                    <p>
                                                        <strong>Price:</strong>{' '}
                                                        {item.price} VND
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Discount Price:
                                                        </strong>{' '}
                                                        {item.discountPrice} VND
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Discount Rate:
                                                        </strong>{' '}
                                                        {item.discountRate} %
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {typeof errors.productSizes === 'string' && (
                                    <p className="text-red-500 text-sm mt-2">
                                        {errors.productSizes}
                                    </p>
                                )}
                                {values.productSizes.map((_, index) => (
                                    <div key={index}>
                                        <div>
                                            <p className="mb-6">
                                                Product size {index + 1}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-1">
                                                    <FormItem
                                                        label="Size"
                                                        invalid={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object' &&
                                                            !!(
                                                                errors
                                                                    .productSizes[
                                                                    index
                                                                ] as any
                                                            )?.size &&
                                                            !!touched
                                                                .productSizes?.[
                                                                index
                                                            ]?.size
                                                        }
                                                        errorMessage={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object'
                                                                ? (
                                                                      errors
                                                                          .productSizes[
                                                                          index
                                                                      ] as any
                                                                  )?.size
                                                                : ''
                                                        }
                                                    >
                                                        <Field
                                                            name={`productSizes[${index}].size`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                return (
                                                                    <Input
                                                                        form={
                                                                            form
                                                                        }
                                                                        field={
                                                                            field
                                                                        }
                                                                        placeholder="Size"
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                                <div className="col-span-1">
                                                    <FormItem
                                                        label="Stock"
                                                        invalid={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object' &&
                                                            !!(
                                                                errors
                                                                    .productSizes[
                                                                    index
                                                                ] as any
                                                            )?.stock &&
                                                            !!touched
                                                                .productSizes?.[
                                                                index
                                                            ]?.stock
                                                        }
                                                        errorMessage={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object'
                                                                ? (
                                                                      errors
                                                                          .productSizes[
                                                                          index
                                                                      ] as any
                                                                  )?.stock
                                                                : ''
                                                        }
                                                    >
                                                        <Field
                                                            name={`productSizes[${index}].stock`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                return (
                                                                    <NumericFormatInput
                                                                        form={
                                                                            form
                                                                        }
                                                                        field={
                                                                            field
                                                                        }
                                                                        placeholder="Stock"
                                                                        customInput={
                                                                            NumberInput as ComponentType
                                                                        }
                                                                        onValueChange={(
                                                                            e,
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                e.value,
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-1">
                                                    <FormItem
                                                        label="Price"
                                                        invalid={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object' &&
                                                            !!(
                                                                errors
                                                                    .productSizes[
                                                                    index
                                                                ] as any
                                                            )?.price &&
                                                            !!touched
                                                                .productSizes?.[
                                                                index
                                                            ]?.price
                                                        }
                                                        errorMessage={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object'
                                                                ? (
                                                                      errors
                                                                          .productSizes[
                                                                          index
                                                                      ] as any
                                                                  )?.price
                                                                : ''
                                                        }
                                                    >
                                                        <Field
                                                            name={`productSizes[${index}].price`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                return (
                                                                    <NumericFormatInput
                                                                        form={
                                                                            form
                                                                        }
                                                                        field={
                                                                            field
                                                                        }
                                                                        placeholder="Price"
                                                                        customInput={
                                                                            PriceInput as ComponentType
                                                                        }
                                                                        onValueChange={(
                                                                            e,
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                e.value,
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                                <div className="col-span-1">
                                                    <FormItem
                                                        label="Discount Price"
                                                        invalid={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object' &&
                                                            !!(
                                                                errors
                                                                    .productSizes[
                                                                    index
                                                                ] as any
                                                            )?.discountPrice &&
                                                            !!touched
                                                                .productSizes?.[
                                                                index
                                                            ]?.discountPrice
                                                        }
                                                        errorMessage={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object'
                                                                ? (
                                                                      errors
                                                                          .productSizes[
                                                                          index
                                                                      ] as any
                                                                  )
                                                                      ?.discountPrice
                                                                : ''
                                                        }
                                                    >
                                                        <Field
                                                            name={`productSizes[${index}].discountPrice`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                return (
                                                                    <NumericFormatInput
                                                                        form={
                                                                            form
                                                                        }
                                                                        field={
                                                                            field
                                                                        }
                                                                        placeholder="Discount Price"
                                                                        customInput={
                                                                            PriceInput as ComponentType
                                                                        }
                                                                        onValueChange={(
                                                                            e,
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                e.value,
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="col-span-1">
                                                    <FormItem
                                                        label="Discount Rate %"
                                                        invalid={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object' &&
                                                            !!(
                                                                errors
                                                                    .productSizes[
                                                                    index
                                                                ] as any
                                                            )?.discountRate &&
                                                            !!touched
                                                                .productSizes?.[
                                                                index
                                                            ]?.discountRate
                                                        }
                                                        errorMessage={
                                                            typeof errors
                                                                .productSizes?.[
                                                                index
                                                            ] === 'object'
                                                                ? (
                                                                      errors
                                                                          .productSizes[
                                                                          index
                                                                      ] as any
                                                                  )
                                                                      ?.discountRate
                                                                : ''
                                                        }
                                                    >
                                                        <Field
                                                            name={`productSizes[${index}].discountRate`}
                                                        >
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                return (
                                                                    <NumericFormatInput
                                                                        form={
                                                                            form
                                                                        }
                                                                        field={
                                                                            field
                                                                        }
                                                                        placeholder="Discount Rate"
                                                                        customInput={
                                                                            TaxRateInput as ComponentType
                                                                        }
                                                                        isAllowed={({
                                                                            floatValue,
                                                                        }) =>
                                                                            (floatValue as number) <=
                                                                            100
                                                                        }
                                                                        onValueChange={(
                                                                            e,
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                e.value,
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                                {values.productSizes.length >
                                                    1 && (
                                                    <div className="col-span-1 flex items-center ">
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
                                    </div>
                                ))}
                                <div className="col-span-1">
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        color="green-500"
                                        icon={<IoIosAddCircle />}
                                        type="button"
                                        onClick={() =>
                                            push({
                                                size: null,
                                                stock: null,
                                                price: null,
                                                discountPrice: null,
                                                discountRate: null,
                                            })
                                        }
                                    ></Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </FieldArray>
        </AdaptableCard>
    )
}

export default SizeFields
