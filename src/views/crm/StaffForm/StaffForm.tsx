import React, { useState, useEffect } from 'react';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import DatePicker from '@/components/ui/DatePicker';
import { Field, Form, Formik, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { apiAddStaff, apiUpdateStaff, apiGetStaffById } from '@/services/StaffService';
import { Staff } from '@/@types/staff';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import dayjs from 'dayjs';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { APP_PREFIX_PATH } from '@/constants/route.constant';

type StaffFormProps = {
    staff?: Staff;
    isEdit?: boolean;
    onUpdate?: (staff: Staff) => void;
};

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().when('isEdit', {
        is: false,
        then: () => Yup.string().required('Password is required'),
        otherwise: () => Yup.string(),
    }),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('Date of birth is required'),
});

const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
];

const defaultInitialValues = {
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    gender: 'MALE',
    dob: dayjs().subtract(18, 'years').toDate(),
};

const StaffForm = ({staff, isEdit} : StaffFormProps) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false)

    const initialValues = isEdit ? {
        fullName: staff?.fullName || '',
        email: staff?.email || '',
        phone: staff?.phone || '',
        username: staff?.username || '',
        password: '',
        gender: staff?.gender || 'MALE',
        dob: staff?.dob ? dayjs(staff.dob).toDate() : dayjs().subtract(18, 'years').toDate(),
    }: defaultInitialValues;

    const handleFormSubmit = async (values: typeof defaultInitialValues) => {
        setSubmitting(true);
        try {
            const staffData: Staff = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                username: values.username,
                password: isEdit ? undefined : values.password,
                gender: values.gender,
                dob: dayjs(values.dob).format('YYYY-MM-DD'),
            };

            let response;

            if (isEdit && staff?.id) {
                response = await apiUpdateStaff(staff.id, staffData);
            } else {
                response = await apiAddStaff(staffData);
            }

            if (response.data && response.data.code === "200") {
                toast.push(
                    <Notification title="Success" type="success">
                        {isEdit ? 'Staff updated successfully' : 'Staff created successfully'}
                    </Notification>
                )
                navigate(`${APP_PREFIX_PATH}/staffs`)
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        {response.data?.message || 'Failed to save staff'}
                    </Notification>
                )
            }
        } catch (error: any) {
            const errorResponse = error.response?.data
            let errorMessage = 'Failed to save staff'
            
            if (errorResponse) {
                switch (errorResponse.code) {
                    case "400":
                        errorMessage = errorResponse.message || 'Invalid staff data'
                        break
                    case "409":
                        errorMessage = errorResponse.message || 'Staff already exists'
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
            setSubmitting(false);
        }
    };

    const handleDiscard = () => {
        navigate(`${APP_PREFIX_PATH}/staffs`);
    };

    return (
        <AdaptableCard>
            <div className="max-w-3xl mx-auto">
                        <div className="mb-6">
                            <h3 className="mb-2">{isEdit ? 'Edit Staff' : 'Add New Staff'}</h3>
                            <p>Basic staff information</p>
                        </div>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleFormSubmit}
                            enableReinitialize
                        >
                            {({ values, touched, errors }) => (
                                <Form>
                                    <FormContainer>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <FormItem
                                                label="Email"
                                                invalid={errors.email && touched.email}
                                                errorMessage={errors.email}
                                            >
                                                <Field
                                                    type="email"
                                                    autoComplete="off"
                                                    disabled={isEdit}
                                                    name="email"
                                                    placeholder="Enter email"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Phone"
                                                invalid={errors.phone && touched.phone}
                                                errorMessage={errors.phone}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="phone"
                                                    disabled={isEdit}
                                                    placeholder="Enter phone number"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Full Name"
                                                invalid={errors.fullName && touched.fullName}
                                                errorMessage={errors.fullName}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="fullName"
                                                    placeholder="Enter full name"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Username"
                                                invalid={errors.username && touched.username}
                                                errorMessage={errors.username}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="username"
                                                    placeholder="Enter username"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            {!isEdit && (
                                                <FormItem
                                                    label="Password"
                                                    invalid={errors.password && touched.password}
                                                    errorMessage={errors.password}
                                                >
                                                    <Field
                                                        type="password"
                                                        autoComplete="off"
                                                        name="password"
                                                        placeholder="Enter password"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            )}
                                            <FormItem
                                                label="Gender"
                                                invalid={errors.gender && touched.gender}
                                                errorMessage={errors.gender}
                                            >
                                                <Field name="gender">
                                                    {({ field, form }: FieldProps) => (
                                                        <Select
                                                            field={field}
                                                            form={form}
                                                            options={genderOptions}
                                                            value={genderOptions.find(
                                                                (option) => option.value === values.gender
                                                            )}
                                                            onChange={(option) =>
                                                                form.setFieldValue(field.name, option?.value)
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                            <FormItem
                                                label="Date of Birth"
                                                invalid={(errors.dob && touched.dob) as boolean}
                                                errorMessage={(errors.dob) as string}
                                            >
                                                <Field name="dob">
                                                    {({ field, form }: FieldProps) => (
                                                        <DatePicker
                                                            field={field}
                                                            form={form}
                                                            value={values.dob}
                                                            onChange={(date) => form.setFieldValue(field.name, date)}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                        <div className="mt-6 flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="plain"
                                                onClick={handleDiscard}
                                                disabled={submitting}
                                            >
                                                Discard
                                            </Button>
                                            <Button
                                                loading={submitting} 
                                                variant="solid"
                                                type="submit"
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
    );
};

export default StaffForm;