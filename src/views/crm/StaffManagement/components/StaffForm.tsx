import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import { FormContainer, FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import Select from '@/components/ui/Select';
import DateTimepicker from '@/components/ui/DatePicker';
import { apiAddStaff } from '@/services/StaffService';
import { useAppDispatch } from '../store';
import { getStaffs } from '../store/staffSlice';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';
import dayjs from 'dayjs';
import { Staff } from '@/@types/staff';

type StaffFormProps = {
    open: boolean;
    onClose: () => void;
};

const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' }, // Giới tính "Other"
];

const staffValidationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('Date of birth is required'),
});

const defaultInitialValues = {
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    gender: 'OTHER',
    dob: dayjs().subtract(18, 'years').toDate(),
};

const StaffForm = ({ open, onClose }: StaffFormProps) => {
    const dispatch = useAppDispatch();
    const formikRef = React.useRef<FormikProps<typeof defaultInitialValues>>(null);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            // Reset form when dialog opens
            if (formikRef.current) {
                formikRef.current.resetForm({
                    values: defaultInitialValues,
                });
            }
        }
    }, [open]);

    const handleDialogClose = () => {
        onClose();
    };

    const handleFormSubmit = async (values: typeof defaultInitialValues) => {
        setSubmitting(true);

        try {
            const staffData: Staff = {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                username: values.username,
                password: values.password,
                gender: values.gender,
                dob: dayjs(values.dob).format('YYYY-MM-DD'),
            };

            console.log('Sending staffData:', staffData); // Debug data

            await apiAddStaff(staffData);
            toast.push(
                <Notification title="Success" type="success">
                    Staff added successfully
                </Notification>
            );

            // Refresh staff list
            dispatch(getStaffs({ page: 1, size: 10 }));
            handleDialogClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to save staff';
            toast.push(
                <Notification title="Error" type="danger">
                    {errorMessage}
                </Notification>
            );
            console.error('API error:', error.response?.data || error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog isOpen={open} onClose={handleDialogClose} width={700}>
            <h4>Add New Staff</h4>
            <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
                <Formik
                    innerRef={formikRef}
                    initialValues={defaultInitialValues}
                    validationSchema={staffValidationSchema}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {({ values, touched, errors, setFieldValue }) => (
                        <Form>
                            <FormContainer>
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
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
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
                                        placeholder="Enter phone number"
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
                                <FormItem
                                    label="Gender"
                                    invalid={errors.gender && touched.gender}
                                    errorMessage={errors.gender}
                                >
                                    <Field name="gender">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                placeholder="Select gender"
                                                field={field}
                                                form={form}
                                                options={genderOptions}
                                                value={genderOptions.find((option) => option.value === values.gender)}
                                                onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <FormItem
                                    label="Date of Birth"
                                    invalid={errors.dob && touched.dob}
                                    errorMessage={errors.dob}
                                >
                                    <Field name="dob">
                                        {({ field, form }: FieldProps) => (
                                            <DateTimepicker
                                                field={field}
                                                form={form}
                                                value={values.dob}
                                                onChange={(date) => form.setFieldValue(field.name, date)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="mt-6 flex justify-end">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        Smoke Testing
                                        type="button"
                                        variant="plain"
                                        onClick={handleDialogClose}
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="solid" loading={submitting} disabled={submitting}>
                                        Create Staff
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </Dialog>
    );
};

export default StaffForm;