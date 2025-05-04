import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { apiChangePassword } from '@/services/AccountServices'
import { ApiResponse } from '@/@types/auth'

type PasswordFormModel = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}
const getValidationSchema = () => {
    return Yup.object().shape({
        oldPassword: Yup.string().required('Current password Required'),
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
    })
}

const Password = () => {
    const onFormSubmit = async (
        values: PasswordFormModel,
        { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void, resetForm: () => void }
    ) => {
        try {
            // call api to update password
            const { oldPassword, newPassword } = values
            const resp = await apiChangePassword<ApiResponse<unknown>>({
                oldPassword,
                newPassword,
            })
            if (resp.data.code === '400') {
                toast.push(
                    <Notification
                        title={'Mật khẩu cũ không chính xác'}
                        type="danger"
                    />,
                    {
                        placement: 'top-center',
                    },
                )
            } else if (resp.data.code === '200') {
                toast.push(
                    <Notification title={'Password updated'} type="success" />,
                    {
                        placement: 'top-center',
                    },
                )
                resetForm()
            }
            setSubmitting(false)
            console.log('values', values)
        } catch (error) {
            console.log('error', error)
            toast.push(
                <Notification
                    title={'Error updating password'}
                    type="danger"
                />,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
                validationSchema={getValidationSchema()}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true)
                    setTimeout(() => {
                        onFormSubmit(values, { setSubmitting, resetForm })
                    }, 1000)
                }}
            >
                {({ touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title="Password"
                                    desc="Enter your current & new password to reset your password."
                                />
                                <p className="text-red-500">
                                    Password must contain at least one uppercase
                                    letter, one lowercase letter, one number and
                                    one special character
                                </p>
                                <FormRow
                                    name="oldPassword"
                                    label="Current Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="oldPassword"
                                        placeholder="Current Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="newPassword"
                                    label="New Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder="New Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <FormRow
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        component={Input}
                                    />
                                </FormRow>
                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                        onClick={() => resetForm()}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        variant="solid"
                                        loading={isSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? 'Updating'
                                            : 'Update Password'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default Password
