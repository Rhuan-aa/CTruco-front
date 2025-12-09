import { useCallback } from "react";
import useAuth from "../context/useAuth";
import useIntel from "../context/useIntel";
import useWebSocket from "../context/useWebSocket";
import useAxiosPrivate from "./useAxiosPrivate";
import useHandleGame from "./useHandleGame";
import useHandleQuit from "./useHandleQuit";

const useCreateGame = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const { setIntel } = useIntel();
    const { subscribe } = useWebSocket();
    const handleGame = useHandleGame();
    const handleQuit = useHandleQuit();

    const withBot = useCallback(async (botName) => {
        try {
            const url = `/api/v1/games/user-bot/`;
            const data = { userUuid: auth.uuid, botName };
            const { data: initialIntel } = await axiosPrivate.post(url, data);
            setIntel({ last: initialIntel, opponentName: botName });
            const gameId = initialIntel.gameId;
        
            subscribe(`/topic/game/${gameId}/state`, handleGame);
            subscribe(`/topic/game/${gameId}/quit`, handleQuit);

            return initialIntel;
        } catch (error) {
            console.log(
                error.response?.headers?.authorization || "Sem response disponível"
            );
        }
    },[auth.uuid, axiosPrivate, setIntel, subscribe, handleGame, handleQuit]);
    return withBot;
}

export default useCreateGame;
