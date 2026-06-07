import { axiosPrivate } from '../../api/axios';
import useAuth from '../context/useAuth';


const useSilentSignIn = () => {
    const { auth, setAuth } = useAuth()

    const silentlySignIn = async () => {
        try {
            if (auth?.uuid) return false
            const response = await axiosPrivate.get('/api/v1/refresh-token')
            const token = response.headers.authorization
            const uuid = response.data.uuid
            const username = response.data.username
            setAuth(prev => ({ ...prev, token, uuid, username }))
            return true
        } catch (error) {
            console.log('Logged out. Please sign in.')
            return false
        }
    }
    return silentlySignIn
}

export default useSilentSignIn