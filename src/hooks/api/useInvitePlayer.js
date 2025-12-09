import useAuth from "../context/useAuth";
import useWebSocket from "../context/useWebSocket";

const useInvitePlayer = () => {
    const { auth: {uuid} } = useAuth();
    const { sendMessage } = useWebSocket();

    const invite = async (playerUuid) => {
        try {
            console.log(playerUuid)
            const destination = `/api/v2/invites/${playerUuid}/invite`;
            sendMessage(destination, uuid);
        } catch (error) {
            console.log(
                error.response?.headers?.authorization || "Sem response disponível"
            );
        }
    }

    return invite;
}

export default useInvitePlayer;