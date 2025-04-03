import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                }}
            >
                <Logo mode="dark" />
                <div>
                    <div className="mb-6 flex items-center gap-4">
                        <Avatar
                            className="border-2 border-white"
                            shape="circle"
                            src="/img/avatars/gpt-logo.png"
                        />
                        <div className="text-black">
                            <div className="font-semibold text-base text-shadow">
                                Chat GPT
                            </div>
                            <span className="opacity-80">CTO, Shiny</span>
                        </div>
                    </div>
                    <p className="text-lg text-black opacity-80 text-shadow">
                        Mỗi món trang sức không chỉ là phụ kiện, mà còn là dấu
                        ấn của phong cách, sự tinh tế và câu chuyện riêng của
                        bạn. Hãy để vẻ đẹp tỏa sáng theo cách của chính bạn!
                    </p>
                </div>
                <span className="text-white text-shadow">
                    Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                    <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                </span>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
