import { axiosPrivate } from '../../api/axios';
import useAuth from '../context/useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth()

    const refresh = async () => {
        const { headers: { authorization: accessToken } } = await axiosPrivate.get('/refresh-token')
        setAuth(prev => ({ ...prev, token: accessToken }))
        return accessToken
    }

    const deleteTokens = async () => {
        try {
            await axiosPrivate.delete('/refresh-token', {headers: {Authorization: auth?.token ? auth?.token : undefined}})
        } catch (error) {
            console.warn("Sessão já expirada no servidor ou erro ao deslogar.");
        } finally {    
            setAuth(null)
        }
    }

    return { refresh, deleteTokens }
}

export default useRefreshToken