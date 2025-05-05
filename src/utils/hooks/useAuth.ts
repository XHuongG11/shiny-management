import { apiSignIn, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import { APP_PREFIX_PATH } from '@/constants/route.constant'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const defaultUser = {
        username: '',
        email: '',
        phone: '',
        fullName: '',
        dob: '',
        gender: '',
        status: '',
        role: '',
    }
    const signIn = async (
        values: SignInCredential,
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        try {
            const resp = await apiSignIn(values)
            if (resp?.data?.data) {
                const token = resp.data.data.token
                dispatch(signInSuccess(token))
                dispatch(setUser(resp.data.data.user || defaultUser))

                const redirectUrl = query.get(REDIRECT_URL_KEY)
                console.log('role user', resp.data?.data?.user?.role)

                if (resp.data?.data?.user?.role === 'MANAGER') {
                    console.log('redirect role MANAGER')
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPath,
                    )
                } else {
                    console.log('redirect role STAFF')
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : `${APP_PREFIX_PATH}/sales/order-list`,
                    )
                }
                return {
                    status: 'success',
                    message: '',
                }
            } else if (resp?.data?.code === '400') {
                return {
                    status: 'failed',
                    message: 'Invalid username or password',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data) {
                const { token } = resp.data
                dispatch(signInSuccess(token))
                if (resp.data.user) {
                    dispatch(setUser(defaultUser))
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                if (resp.data?.user?.role === 'MANAGER') {
                    console.log('redirect role MANAGER')
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : appConfig.authenticatedEntryPath,
                    )
                } else {
                    console.log('redirect role STAFF')
                    navigate(
                        redirectUrl
                            ? redirectUrl
                            : `${APP_PREFIX_PATH}/sales/order-list`,
                    )
                }
                return {
                    status: 'success',
                    message: '',
                }
            }
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(setUser(defaultUser))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = () => {
        // await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth
