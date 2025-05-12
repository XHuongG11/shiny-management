import { useState, useEffect } from 'react'
import { Tabs, Button, notification } from 'antd'
import { useAppDispatch, useAppSelector } from './store'
import { injectReducer } from '@/store'
import reducer from './store'
import { 
    fetchBanners, 
    fetchPrivacyPolicy, 
    setType 
} from './store/catalogSlice'
import BannerList from './components/BannerList'
import PrivacyPolicyEditor from './components/PrivacyPolicyEditor'
import { WebContentType } from '@/@types/webContent'
import AdaptableCard from '@/components/shared/AdaptableCard'

const { TabPane } = Tabs

injectReducer('webContent', reducer)

const WebContentManagement = () => {
    const dispatch = useAppDispatch()
    const { type, loading, error } = useAppSelector((state) => state.webContent.state)
    
    useEffect(() => {
        dispatch(fetchBanners())
        dispatch(fetchPrivacyPolicy())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            notification.error({
                message: 'Error',
                description: error,
            })
        }
    }, [error])

    const handleTabChange = (key: string) => {
        dispatch(setType(key as WebContentType))
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Website Content Management</h3>
            </div>
            <Tabs activeKey={type} onChange={handleTabChange}>
                <TabPane tab="Banner Management" key="Banner">
                    <BannerList />
                </TabPane>
                <TabPane tab="Privacy Policy" key="Privacy">
                    <PrivacyPolicyEditor />
                </TabPane>
            </Tabs>
        </AdaptableCard>
    )
}

export default WebContentManagement