import useAuth from '../context/useAuth';
import useIntel from '../context/useIntel';
import useWebSocket from '../context/useWebSocket';

const useThrowCard = () => {
    const { auth: { uuid } } = useAuth()
    const { sendMessage } = useWebSocket()
    const { intel } = useIntel()

    const throwCardAs = async (card, action) => {
        try {
            const timestamp = intel.last.timestamp
            const destination = `/api/v2/games/players/${uuid}/cards/${action}`;
            const gameId = intel.last.gameId;
            const body = { 
                gameUuid: gameId, 
                card: card, 
                timestamp: timestamp 
            };
            console.log(body)
            sendMessage(destination, body);
        }
        catch (error) {
            console.log(error.response.headers.authorization)
        }
    }
    return throwCardAs
}

export default useThrowCard