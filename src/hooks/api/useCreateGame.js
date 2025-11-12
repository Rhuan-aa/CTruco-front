import useAuth from "../context/useAuth";
import useIntel from "../context/useIntel";
import useWebSocket from "../context/useWebSocket";
import useAxiosPrivate from "./useAxiosPrivate";

const useCreateGame = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { setIntel } = useIntel();
    const { subscribe } = useWebSocket();

    // async function processIntelSince(intelSince) {
    //     console.log("Processando " + intelSince.length + " novos intel(s).");

    //     if (intelSince.length === 0) return;

    //     const mostRecent = intelSince.slice(-1)[0];

    //     setIntel((prevState) => {
    //         const lastIntel = prevState && prevState.last ? prevState.last : null;
    //         const missing = lastIntel ? [lastIntel, ...intelSince] : intelSince;

    //         return {
    //             ...prevState,
    //             last: mostRecent,
    //             missing,
    //         };
    //     });
    // }

    // const handleGame = (message) => {
    //     if (message.body === null) return;
    //     try {
    //         const data = JSON.parse(message.body);
    //         const intelSince = data.intelSinceBaseTimestamp;
    //         if (!intelSince || intelSince.length === 0) {
    //             return;
    //         }
    //         processIntelSince(intelSince);
    //     } catch (error) {
    //         console.error("Erro ao processar mensagem do WebSocket:", error);
    //     }
    // };

    const withBot = async (botName) => {
        try {
            const url = `/api/v1/games/user-bot/`;
            const data = { userUuid: auth.uuid, botName };

            const { data: initialIntel } = await axiosPrivate.post(url, data);

            setIntel({ last: initialIntel, opponentName: botName });

            const gameId = initialIntel.gameId;
        
            subscribe(`/topic/game/${gameId}`);

            return initialIntel;
        } catch (error) {
            console.log(
                error.response?.headers?.authorization || "Sem response disponível"
            );
        }
    };
    return withBot;
};

export default useCreateGame;
