import { Notification, Select, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store'
import { useState } from 'react'
import { HiPlusCircle } from 'react-icons/hi'
import { setType } from '../store/catalogSlice'
import { addCollection } from '../store/collectionsSlice'
import { addCategory } from '../store/categoriesSlice'
import CollectionModal from './CollectionModal'
import CategoryModal from './CategoryModal'
import { Category } from '@/@types/product'

const CatalogTableTools = () => {
    const dispatch = useAppDispatch()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleAdd = () => {
        setIsModalOpen(true)
    }
    const handleSubmitCollection = async (values: {
        name: string
        description: string
    }) => {
        console.log('Submitting new collection:', values)
        try {
            const resp = await dispatch(
                addCollection({
                    name: values.name,
                    description: values.description.replace(/<\/?p>/g, ''),
                }),
            )
            if (resp.meta.requestStatus === 'fulfilled') {
                toast.push(
                    <Notification
                        title={'Successfuly added'}
                        type="success"
                        duration={2500}
                    >
                        Collection successfuly added
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            }
        } catch (error) {
            console.error('Error submitting new collection:', error)
        }
    }

    const handleSubmitCategory = async (values: {
        name: string
        parent?: Category | null
    }) => {
        try {
            const resp = await dispatch(
                addCategory({
                    name: values.name,
                    parent: values.parent || undefined,
                }),
            )
            if (resp.meta.requestStatus === 'fulfilled') {
                toast.push(
                    <Notification
                        title={'Successfully added'}
                        type="success"
                        duration={2500}
                    >
                        Category successfully added
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
            }
        } catch (error) {
            toast.push(
                <Notification
                    title={'Error adding category'}
                    type="danger"
                    duration={2500}
                >
                    Failed to add category
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    const options = [
        { value: 'Category', label: 'Category' },
        { value: 'Collection', label: 'Collection' },
    ]

    const [selectedValue, setSelectedValue] = useState(options[0])

    const handleSelectChange = (
        option: { value: string; label: string } | null,
    ) => {
        if (option) {
            setSelectedValue(option)
            dispatch(setType(option.value))
        }
    }
    const type = useAppSelector((state) => state.salesCatalog.catalog?.type)

    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <Select
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                size="sm"
                menuPlacement="top"
                isSearchable={false}
                value={selectedValue}
                options={options}
                onChange={(option) => handleSelectChange(option)}
            />
            <div className="block lg:inline-block md:mb-0 mb-4">
                <Button
                    block
                    variant="solid"
                    size="sm"
                    icon={<HiPlusCircle />}
                    onClick={handleAdd}
                >
                    Add
                </Button>
            </div>
            {type === 'Collection' ? (
                <CollectionModal
                    isOpen={isModalOpen}
                    initialData={{ name: '', description: '' }}
                    type="new"
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmitCollection}
                />
            ) : (
                <CategoryModal
                    isOpen={isModalOpen}
                    initialData={{ name: '', parent: null }}
                    type="new"
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmitCategory}
                />
            )}
        </div>
    )
}

export default CatalogTableTools
