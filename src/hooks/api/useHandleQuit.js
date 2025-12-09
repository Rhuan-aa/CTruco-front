import { useCallback } from "react";
import useIntel from "../context/useIntel";
import useWebSocket from "../context/useWebSocket";
import { useNavigate } from "react-router-dom";


const useHandleQuit = () => {
    const { setIntel } = useIntel();
    const { unsubscribe } = useWebSocket();
    const navigate = useNavigate();

    const handleQuit = useCallback((payload) => {
        const gameId = JSON.parse(payload.body);

        unsubscribe(`/topic/game/${gameId}/state`);
        unsubscribe(`/topic/game/${gameId}/quit`);

        setIntel(null);
        navigate("/");
        console.log("saindo do jogo");
    },[unsubscribe, setIntel, navigate])

    return handleQuit;
}

export default useHandleQuit;