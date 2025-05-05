import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import CategoryFields from './CategoryForm'
import { AiOutlineSave } from 'react-icons/ai'
import { Button } from '@/components/ui'
import { Category } from '@/@types/product'

type FormFields = {
    id?: number
    name: string
    parent?: Category | null
}

type Props = {
    isOpen: boolean
    onClose: () => void
    initialData: FormFields
    onSubmit: (values: FormFields) => void
    type: 'edit' | 'new'
}

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
})

const CategoryModal = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    type,
}: Props) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-gray-900"
                                >
                                    {type === 'edit'
                                        ? 'Edit Category'
                                        : 'Add Category'}
                                </Dialog.Title>

                                <Formik
                                    initialValues={initialData}
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => {
                                        onSubmit(values)
                                        onClose()
                                    }}
                                    enableReinitialize
                                >
                                    {({ errors, touched, isSubmitting }) => (
                                        <Form className="mt-4 space-y-4">
                                            <CategoryFields
                                                errors={errors}
                                                touched={touched}
                                            />
                                            <div className="flex justify-end">
                                                <Button
                                                    size="sm"
                                                    className="ltr:mr-3 rtl:ml-3"
                                                    type="button"
                                                    onClick={onClose}
                                                >
                                                    Discard
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    loading={isSubmitting}
                                                    icon={<AiOutlineSave />}
                                                    type="submit"
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default CategoryModal
