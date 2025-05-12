import React, { useState, useEffect } from 'react'
import { Card, Form, message, Spin } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useAppDispatch, useAppSelector } from '../store'
import { updatePrivacyPolicy } from '../store/catalogSlice'
import { Button } from '@/components/ui'

const PrivacyPolicyEditor: React.FC = () => {
    const dispatch = useAppDispatch()
    const privacyPolicy = useAppSelector((state) => state.webContent.state.privacyPolicy)
    const loading = useAppSelector((state) => state.webContent.state.loading)
    const [content, setContent] = useState('')
    const [form] = Form.useForm()
    
    useEffect(() => {
        if (privacyPolicy?.content) {
            setContent(privacyPolicy.content)
            form.setFieldsValue({ content: privacyPolicy.content })
        }
    }, [privacyPolicy, form])
    
    const handleContentChange = (value: string) => {
        setContent(value)
    }
    
    const handleSubmit = async () => {
        try {
            await dispatch(updatePrivacyPolicy(content)).unwrap()
            message.success('Privacy policy updated successfully')
        } catch (error) {
            message.error('Failed to update privacy policy')
        }
    }
    
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            [{ color: [] }],
            ['clean'],
        ],
    }
    
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image',
        'align',
        'color',
    ]
    
    if (loading && !privacyPolicy) {
        return <Spin size="large" />
    }
    
    return (
        <Card title="Privacy Policy Content">
            <Form form={form} layout="vertical">
                <Form.Item label="Content" name="content">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={handleContentChange}
                        modules={modules}
                        formats={formats}
                        style={{ height: '400px', marginBottom: '50px' }}
                    />
                </Form.Item>
                
                <Form.Item>
                    <Button 
                        type="submit" 
                        variant="solid"
                        onClick={handleSubmit}
                        loading={loading}
                    >
                        Update Privacy Policy
                    </Button>
                </Form.Item>
            </Form>
            
            {privacyPolicy && (
                <div className="metadata">
                    <p><strong>Last Updated:</strong> {privacyPolicy.updatedAt || privacyPolicy.createdAt}</p>
                </div>
            )}
        </Card>
    )
}

export default PrivacyPolicyEditor