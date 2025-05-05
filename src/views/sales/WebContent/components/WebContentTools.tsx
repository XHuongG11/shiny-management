import Button from '@/components/ui/Button'
import { Notification, Select, toast } from '@/components/ui'
import { useState } from 'react'
import { HiPlusCircle } from 'react-icons/hi'
import { useAppDispatch, useAppSelector } from '../store'
import { setType } from '../store/catalogSlice'
import { WebContentType } from '@/@types/webContent'

const WebContentTools = () => {
    const dispatch = useAppDispatch()
    const type = useAppSelector((state) => state.webContent.state.type)

    const options = [
        { value: 'Banner', label: 'Banner Management' },
        { value: 'Privacy', label: 'Privacy Policy' },
    ]

    const handleSelectChange = (option: { value: string; label: string } | null) => {
        if (option) {
            dispatch(setType(option.value as WebContentType))
        }
    }

    const handleAdd = () => {
        if (type === 'Banner') {
            // Open banner creation modal
            toast.push(
                <Notification title="Add Banner" type="info" duration={2500}>
                    Banner creation functionality will be implemented soon
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } else {
            // Open privacy policy editor
            toast.push(
                <Notification title="Edit Privacy Policy" type="info" duration={2500}>
                    You can edit the privacy policy in the editor below
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    const selectedValue = options.find(option => option.value === type) || options[0]

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
                    {type === 'Banner' ? 'Add Banner' : 'Edit Policy'}
                </Button>
            </div>
        </div>
    )
}

export default WebContentTools