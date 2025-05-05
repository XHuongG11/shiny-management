import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useAppSelector } from '@/store'

function useAuthority(
    userAuthority: string[] = [],
    authority: string[] = [],
    emptyCheck = false,
) {
    const userRoles = useAppSelector((state) => state.auth.user.role)
    const roleMatched = useMemo(() => {
        const authorityRoles = Array.isArray(authority) ? authority : []

        if (isEmpty(userRoles)) {
            return false
        }

        if (isEmpty(authorityRoles)) {
            return emptyCheck ? false : true
        }

        return authorityRoles.some((role) => userRoles.includes(role))
    }, [userAuthority, authority, emptyCheck])

    return roleMatched
}

export default useAuthority
