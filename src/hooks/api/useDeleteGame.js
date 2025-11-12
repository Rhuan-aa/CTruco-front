import useAuth from '../context/useAuth'
import useIntel from '../context/useIntel'
import useAxiosPrivate from './useAxiosPrivate'

const useDeleteGame = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth: { uuid } } = useAuth()
    const { setIntel } = useIntel()

    const deleteConcludedGame = async () => {
        try {
            
            const url = `/api/v1/games/players/${uuid}`
            await axiosPrivate.delete(url)
            setIntel(null)
        }
        catch (error) {
            console.log(error.response.headers.authorization)
        }
    }
    return deleteConcludedGame
}

export default useDeleteGame