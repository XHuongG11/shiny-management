import HorizontalMenuContent from './HorizontalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'

const HorizontalNav = () => {
    const mode = useAppSelector((state) => state.theme.mode)
    let userAuthority = [] as string[]
    const role = useAppSelector((state) => state.auth.user.role)
    if (role === 'Manager') {
        userAuthority = ['admin', 'user']
    } else if (role === 'Staff') {
        userAuthority = ['user']
    }
    const { larger } = useResponsive()

    return (
        <>
            {larger.md && (
                <HorizontalMenuContent
                    manuVariant={mode}
                    userAuthority={userAuthority}
                />
            )}
        </>
    )
}

export default HorizontalNav
