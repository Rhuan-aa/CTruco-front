import { useCallback } from "react";
import useIntel from "../context/useIntel";
import useWebSocket from "../context/useWebSocket";
import { useNavigate } from "react-router-dom";
import useInvite from "../context/useInvite";
import useHandleGame from "./useHandleGame";
import useHandleQuit from "./useHandleQuit";

const useReceiveInvite = () => {
    const { setIntel } = useIntel();
    const { subscribe, unsubscribe } = useWebSocket();
    const { setInvite } = useInvite();
    const navigate = useNavigate();
    const handleGame = useHandleGame()
    const handleQuit = useHandleQuit()

    const handleInviteResponse = useCallback((payload, inviteUuid) => {
        const finalResponse = JSON.parse(payload.body);

        if (finalResponse.responseType === "ACCEPTED") {
            const intel = finalResponse.intel
            const gameId = intel.gameId;
            setIntel({ last: intel, opponentName: intel.currentOpponentUsername });
            unsubscribe(`/topic/invite/${inviteUuid}`);
            subscribe(`/topic/game/${gameId}/state`, handleGame);
            subscribe(`/topic/game/${gameId}/quit`, handleQuit);
            navigate("/mat/game");
            return;
        }

        if (finalResponse.responseType === "DECLINED") {
            unsubscribe(`/topic/invite/${inviteUuid}`);
            navigate("/");
            return;
        }
    }, [navigate, unsubscribe, setIntel, subscribe, handleGame, handleQuit]);

    const receiveInvite = useCallback((payload) => {
        const inviteResponse = JSON.parse(payload.body);
        const inviteUuid = inviteResponse.inviteUuid;
        const responseFor = inviteResponse.responseFor;

        subscribe(`/topic/invite/${inviteUuid}`, (payload) =>
            handleInviteResponse(payload, inviteUuid)
        );

        if (responseFor === "INVITED") {
            navigate("/invite");
        }

        if (responseFor === "HOST") {
            navigate("/invite/waiting");
        }

        setInvite(inviteResponse);

    }, [navigate, subscribe, setInvite, handleInviteResponse]);

    return receiveInvite;
}

export default useReceiveInvite;