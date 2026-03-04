import useAuth from '../context/useAuth'
import useIntel from '../context/useIntel'
import useWebSocket from '../context/useWebSocket';

const useQuitGame = () => {
    const { auth: { uuid } } = useAuth()
    const { intel } = useIntel()
    const { sendMessage } = useWebSocket();

    const QuitGame = async () => {
        try {
            const gameId = intel.last.gameId;
            const destination = `/api/v2/games/${gameId}/quit`
            sendMessage(destination, uuid)
        }
        catch (error) {
            console.log(error.response.headers.authorization)
        }
    }
    return QuitGame
}

export default useQuitGame