import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import {
    apiSendEmailResetPassword,
    apiVerifyResetPassword,
} from '@/services/AuthService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik, FieldInputProps, FormikProps } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'
import { Select } from '@/components/ui'
import { ApiResponse } from '@/@types/auth'

interface ForgotPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    email: string
    role: string
    newPassword: string
    confirmPassword: string
    code: string
}

const getValidationSchema = (emailSent: boolean) => {
    return Yup.object().shape({
        email: Yup.string()
            .required('Please enter your email')
            .email('Please enter a valid email'),
        role: Yup.string()
            .required('Please select a role')
            .oneOf(['STAFF', 'MANAGER'], 'Invalid role selected'),
        ...(emailSent && {
            code: Yup.string()
                .required('Please enter your code')
                .length(4, 'Code must be 6 characters'),
            newPassword: Yup.string()
                .required('Please enter your new password')
                .min(8, 'Password must be at least 8 characters')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]/,
                    'Password not strong enough',
                ),
            confirmPassword: Yup.string()
                .required('Please enter your confirm password')
                .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
        }),
    })
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [emailSent, setEmailSent] = useState(false)
    const [type, setType] = useState<'success' | 'info' | 'warning' | 'danger'>(
        'danger',
    )
    const [message, setMessage] = useTimeOutMessage()

    const roleOptions = [
        { label: 'Staff', value: 'STAFF' },
        { label: 'Manager', value: 'MANAGER' },
    ]

    const onSendMail = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)
        try {
            console.log('values', values)
            if (emailSent === false) {
                const requestData = {
                    email: values.email,
                    role: values.role,
                }
                console.log('values', values)
                const resp =
                    await apiSendEmailResetPassword<ApiResponse<unknown>>(
                        requestData,
                    )
                console.log('resp', resp)
                if (resp.data?.code === '1000') {
                    setMessage('Email không tồn tại.')
                    setSubmitting(false)
                } else if (resp.data?.code === '200') {
                    setSubmitting(false)
                    setEmailSent(true)
                }
            } else {
                const requestData = {
                    email: values.email,
                    role: values.role,
                    code: values.code,
                    newPassword: values.newPassword,
                }
                const resp =
                    await apiVerifyResetPassword<ApiResponse<unknown>>(
                        requestData,
                    )
                console.log('resp', resp)
                if (resp.data?.code === '400') {
                    setMessage('Code không đúng.')
                    setSubmitting(false)
                } else if (resp.data?.code === '200') {
                    setType('success')
                    setMessage('Đổi mật khẩu thành công')
                    setSubmitting(false)
                    setEmailSent(false)
                }
            }
        } catch (errors) {
            setMessage(
                (errors as AxiosError<{ message: string }>)?.response?.data
                    ?.message || (errors as Error).toString(),
            )
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <h3 className="mb-1">Check your email</h3>
                        <p>Please enter the code we just sent to your email.</p>
                        <p className="text-red-600">
                            Password must contain at least one uppercase letter,
                            one lowercase letter, one number and one special
                            character
                        </p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">Forgot Password</h3>
                        <p>
                            Please enter your email address to receive a
                            verification code.
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type={type}>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    email: 'admin@mail.com',
                    role: 'STAFF',
                    code: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
                validationSchema={getValidationSchema(emailSent)}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSendMail(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div>
                                <FormItem
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Email"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    invalid={errors.role && touched.role}
                                    errorMessage={errors.role}
                                >
                                    <Field name="role">
                                        {({
                                            field,
                                            form,
                                        }: {
                                            field: FieldInputProps<string>
                                            form: FormikProps<ForgotPasswordFormSchema>
                                        }) => (
                                            <Select
                                                value={
                                                    roleOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            form.values.role,
                                                    ) || null
                                                }
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option?.value,
                                                    )
                                                }
                                                options={roleOptions}
                                                placeholder="Select Role"
                                                classNamePrefix="react-select"
                                                className="react-select-container"
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>
                            <div className={!emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.code && touched.code}
                                    errorMessage={errors.code}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="code"
                                        placeholder="Code"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className={!emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={
                                        errors.newPassword &&
                                        touched.newPassword
                                    }
                                    errorMessage={errors.newPassword}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder="New Password"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <div className={!emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={
                                        errors.confirmPassword &&
                                        touched.confirmPassword
                                    }
                                    errorMessage={errors.confirmPassword}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent ? 'Resend Email' : 'Send Email'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
