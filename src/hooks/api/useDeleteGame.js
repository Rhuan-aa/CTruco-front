import useIntel from '../context/useIntel'
import useWebSocket from '../context/useWebSocket';

const useDeleteGame = () => {
    const { intel } = useIntel()
    const { sendMessage } = useWebSocket();

    const deleteConcludedGame = async () => {
        try {
            const game = intel.last;
            const gameId = game.gameId
            const loserUuid = game.players.find(p => p.uuid !== intel.last.gameWinner).uuid;
            const destination = `/api/v2/games/${gameId}/quit`
            sendMessage(destination, loserUuid)
        }
        catch (error) {
            console.error("Erro ao deletar o jogo:", error);
        }
    }
    return deleteConcludedGame
}

export default useDeleteGame