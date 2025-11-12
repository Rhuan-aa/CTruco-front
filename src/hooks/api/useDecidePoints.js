import useAuth from '../context/useAuth'
import useIntel from '../context/useIntel'
import useWebSocket from '../context/useWebSocket'

const useDecidePoints = () => {
    const { auth: { uuid } } = useAuth()
    const { intel } = useIntel() 
    const { sendMessage } = useWebSocket()

    const decideTo = async (action) => {
        try {
            const timestamp = intel.last.timestamp 
            const destination = `/api/v2/games/players/${uuid}/${action}`;
            const gameId = intel.last.gameId;
            const body = { 
                gameUuid: gameId, 
                timestamp: timestamp
            }
            sendMessage(destination, body)
        }
        catch (error) {
            console.log(error.response.headers.authorization)
        }
    }
    return decideTo
}

export default useDecidePoints