import { useState } from 'react'
import { 
    Table, 
    Space, 
    Image, 
    Modal, 
    Form, 
    message
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { HiEye } from 'react-icons/hi'
import { useAppDispatch, useAppSelector } from '../store'
import { Banner } from '@/@types/webContent'
import { updateBanner } from '../store/catalogSlice'
import { Button } from '@/components/ui'
import Upload from '@/components/ui/Upload'
import Dialog from '@/components/ui/Dialog'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

const BannerList = () => {
    const dispatch = useAppDispatch()
    const { banners } = useAppSelector((state) => state.webContent.state)
    const loading = useAppSelector((state) => state.webContent.state.loading)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
    const [form] = Form.useForm()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string>('')
    const [viewImageOpen, setViewImageOpen] = useState(false)
    const [viewingImage, setViewingImage] = useState<string>('')

    const handleEdit = (record: Banner) => {
        setEditingBanner(record)
        form.setFieldsValue({
            name: record.name,
            position: record.position,
        })
        setPreviewImage("http://localhost:8080" + record.url)
        setIsModalVisible(true)
    }

    const handleModalCancel = () => {
        setIsModalVisible(false)
        setEditingBanner(null)
        form.resetFields()
        setImageFile(null)
        setPreviewImage('')
    }

    const handleUpdateBanner = async (values: any) => {
        if (editingBanner?.id) {
            const formData = new FormData()
            formData.append('position', values.position)
            
            if (imageFile) {
                formData.append('image', imageFile)
            }

            try {
                await dispatch(updateBanner({ id: editingBanner.id, formData })).unwrap()
                message.success('Banner updated successfully')
                setIsModalVisible(false)
                setEditingBanner(null)
                form.resetFields()
                setImageFile(null)
            } catch (error) {
                message.error('Failed to update banner')
            }
        }
    }

    const beforeUpload = (file: FileList | null) => {
        let valid: boolean | string = true

        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }

                if (f.size >= maxFileSize) {
                    valid = 'Upload image cannot be more than 500kb!'
                }
            }
        }

        return valid
    }

    const handleImageUpload = (files: File[]) => {
        if (files && files.length > 0) {
            const file = files[files.length - 1]
            setImageFile(file)
            
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleViewImage = (imageUrl: string) => {
        setViewingImage(imageUrl)
        setViewImageOpen(true)
    }

    const handleViewImageClose = () => {
        setViewImageOpen(false)
        setTimeout(() => {
            setViewingImage('')
        }, 300)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Image',
            dataIndex: 'url',
            key: 'url',
            render: (url: string) => (
                <div className="relative group rounded p-2 inline-block">
                    <Image 
                        src={"http://localhost:8080" + url}
                        alt="Banner" 
                        height={160} 
                        style={{ objectFit: 'contain' }}
                        fallback="data:image/png;base64,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"
                        preview={false}
                    />
                    <div className="absolute inset-0 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => handleViewImage("http://localhost:8080" + url)}
                        >
                            <HiEye />
                        </span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Banner) => (
                <Space size="middle">
                    <Button 
                        type="submit"
                        variant='solid' 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <Table 
                dataSource={banners} 
                columns={columns} 
                rowKey="id" 
                loading={loading}
            />
            
            <Modal
                title="Edit Banner"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateBanner}
                >              
                    <Form.Item
                        label="Banner Image"
                    >
                        {previewImage ? (
                            <div className="mb-4">
                                <div className="relative group rounded border p-2 inline-block">
                                    <img 
                                        src={previewImage} 
                                        alt="Banner Preview" 
                                        className="rounded max-h-[140px]"
                                    />
                                </div>
                                <div className="mt-4">
                                    <Upload
                                        draggable
                                        className="w-full h-24"
                                        beforeUpload={beforeUpload}
                                        showList={false}
                                        onChange={handleImageUpload}
                                    >
                                        <div className="flex flex-col h-full justify-center items-center">
                                            <DoubleSidedImage
                                                src="/img/others/upload.png"
                                                darkModeSrc="/img/others/upload-dark.png"
                                            />
                                            <p className="font-semibold text-center text-gray-800 dark:text-white">
                                                Change Image
                                            </p>
                                        </div>
                                    </Upload>
                                </div>
                            </div>
                        ) : (
                            <Upload
                                draggable
                                className="w-full"
                                beforeUpload={beforeUpload}
                                showList={false}
                                onChange={handleImageUpload}
                            >
                                <div className="my-16 text-center">
                                    <DoubleSidedImage
                                        className="mx-auto"
                                        src="/img/others/upload.png"
                                        darkModeSrc="/img/others/upload-dark.png"
                                    />
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Drop your image here, or{' '}
                                        </span>
                                        <span className="text-blue-500">
                                            browse
                                        </span>
                                    </p>
                                    <p className="mt-1 opacity-60 dark:text-white">
                                        Support: jpeg, png
                                    </p>
                                </div>
                            </Upload>
                        )}
                    </Form.Item>
                    
                    <Form.Item>
                        <Space>
                            <Button type="submit" variant="solid" loading={loading}>
                                Save
                            </Button>
                            <Button onClick={handleModalCancel}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Dialog
                isOpen={viewImageOpen}
                onClose={handleViewImageClose}
                onRequestClose={handleViewImageClose}
            >
                <h5 className="mb-4">Banner Preview</h5>
                <img
                    className="w-full"
                    src={viewingImage}
                    alt="Banner"
                />
            </Dialog>
        </div>
    )
}

export default BannerList