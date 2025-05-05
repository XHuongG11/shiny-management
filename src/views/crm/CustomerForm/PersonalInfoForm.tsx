import Avatar from '@/components/ui/Avatar'
import { FormItem } from '@/components/ui/Form'
import {
    HiUserCircle,
    HiMail,
    HiLocationMarker,
    HiPhone,
    HiCake,
    HiOutlineUser,
    HiTag,
    HiCurrencyDollar,
    HiCheckCircle,
} from 'react-icons/hi'
import { FormikErrors, FormikTouched } from 'formik'
import dayjs from 'dayjs'

type FormFieldsName = {
    upload: string
    name: string
    title: string
    email: string
    location: string
    phoneNumber: string
    birthday: Date
}

type PersonalInfoFormProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    readOnly?: boolean
    customer: any
}

const PersonalInfoForm = (props: PersonalInfoFormProps) => {
    const { touched, errors, readOnly, customer } = props

    if (readOnly) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem label="Avatar">
                    <Avatar
                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                        size={100}
                        shape="circle"
                        icon={<HiOutlineUser />}
                        src={customer.avatar || customer.img || '/img/default-avatar.png'}
                    />
                </FormItem>
                <FormItem label="Name">
                    <div className="flex items-center">
                        <HiUserCircle className="text-xl mr-2" />
                        <span>{customer.fullName || customer.name || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Username">
                    <div className="flex items-center">
                        <HiUserCircle className="text-xl mr-2" />
                        <span>{customer.username || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Email">
                    <div className="flex items-center">
                        <HiMail className="text-xl mr-2" />
                        <span>{customer.email || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Phone Number">
                    <div className="flex items-center">
                        <HiPhone className="text-xl mr-2" />
                        <span>{customer.phone || customer.phoneNumber || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Birthday">
                    <div className="flex items-center">
                        <HiCake className="text-xl mr-2" />
                        <span>
                            {customer.dob
                                ? dayjs(customer.dob).format('MM/DD/YYYY')
                                : customer.birthday
                                ? dayjs(customer.birthday).format('MM/DD/YYYY')
                                : 'N/A'}
                        </span>
                    </div>
                </FormItem>
                <FormItem label="Status">
                    <div className="flex items-center">
                        <HiCheckCircle className="text-xl mr-2" />
                        <span>{customer.status || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Gender">
                    <div className="flex items-center">
                        <HiUserCircle className="text-xl mr-2" />
                        <span>{customer.gender || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Membership Rank">
                    <div className="flex items-center">
                        <HiTag className="text-xl mr-2" />
                        <span>{customer.membershipRank || 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Total Spent">
                    <div className="flex items-center">
                        <HiCurrencyDollar className="text-xl mr-2" />
                        <span>{customer.totalSpent != null ? `$${customer.totalSpent}` : 'N/A'}</span>
                    </div>
                </FormItem>
                <FormItem label="Subscribed for News">
                    <div className="flex items-center">
                        <HiCheckCircle className="text-xl mr-2" />
                        <span>{customer.isSubscribedForNews ? 'Yes' : 'No'}</span>
                    </div>
                </FormItem>
                <FormItem label="Role">
                    <div className="flex items-center">
                        <HiUserCircle className="text-xl mr-2" />
                        <span>{customer.role || 'N/A'}</span>
                    </div>
                </FormItem>
            </div>
        )
    }

    return (
        <>
            <FormItem
                invalid={errors.upload && touched.upload}
                errorMessage={errors.upload}
            >
                <Field name="img">
                    {({ field, form }: FieldProps) => {
                        const avatarProps = field.value
                            ? { src: field.value }
                            : {}
                        return (
                            <div className="flex justify-center">
                                <Upload
                                    className="cursor-pointer"
                                    showList={false}
                                    uploadLimit={1}
                                    onChange={(files) =>
                                        form.setFieldValue(
                                            field.name,
                                            URL.createObjectURL(files[0])
                                        )
                                    }
                                    onFileRemove={(files) =>
                                        form.setFieldValue(
                                            field.name,
                                            URL.createObjectURL(files[0])
                                        )
                                    }
                                >
                                    <Avatar
                                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                                        size={100}
                                        shape="circle"
                                        icon={<HiOutlineUser />}
                                        {...avatarProps}
                                    />
                                </Upload>
                            </div>
                        )
                    }}
                </Field>
            </FormItem>
            <FormItem
                label="Name"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Name"
                    component={Input}
                    prefix={<HiUserCircle className="text-xl" />}
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
                    placeholder="Email"
                    component={Input}
                    prefix={<HiMail className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Location"
                invalid={errors.location && touched.location}
                errorMessage={errors.location}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="location"
                    placeholder="Location"
                    component={Input}
                    prefix={<HiLocationMarker className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Phone Number"
                invalid={errors.phoneNumber && touched.phoneNumber}
                errorMessage={errors.phoneNumber}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    component={Input}
                    prefix={<HiPhone className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Title"
                invalid={errors.title && touched.title}
                errorMessage={errors.title}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="title"
                    placeholder="Title"
                    component={Input}
                    prefix={<HiPhone className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Birthday"
                invalid={(errors.birthday && touched.birthday) as boolean}
                errorMessage={errors.birthday as string}
            >
                <Field name="birthday" placeholder="Date">
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            field={field}
                            form={form}
                            value={field.value}
                            inputPrefix={<HiCake className="text-xl" />}
                            onChange={(date) => {
                                form.setFieldValue(field.name, date)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
        </>
    )
}

export default PersonalInfoForm