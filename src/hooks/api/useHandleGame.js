import { useCallback } from "react";
import useIntel from "../context/useIntel";


const useHandleGame = () => {
    const { setIntel } = useIntel()

    const processIntelSince = useCallback( async (intelSince) => {

        if (intelSince.length === 0) return;

        const mostRecent = intelSince.slice(-1)[0];

        setIntel((prevState) => {
            const lastIntel = prevState && prevState.last ? prevState.last : null;
            const missing = lastIntel ? [lastIntel, ...intelSince] : intelSince;

            return {
                ...prevState,
                last: mostRecent,
                missing,
            };
        });
    }, [setIntel]);

    const handleGame = useCallback((message) => {
        if (message.body === null) return;
        try {
            const data = JSON.parse(message.body);
            const intelSince = data.intelSinceBaseTimestamp;
            if (!intelSince || intelSince.length === 0) {
                return;
            }
            processIntelSince(intelSince);
        } catch (error) {
            console.error("Erro ao processar mensagem do WebSocket:", error);
        }
    }, [processIntelSince]);

    return handleGame;
}

export default useHandleGame;