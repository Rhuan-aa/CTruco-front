import { useEffect, useState } from "react";
import { Spinner } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./InviteWaiting.css";
import useWebSocket from "../../hooks/context/useWebSocket";
import useInvite from "../../hooks/context/useInvite";

const InviteWaiting = () => {
  const navigate = useNavigate();
  const { invite, setInvite } = useInvite();
  const { sendMessage } = useWebSocket();

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (!invite) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [invite]);

  useEffect(() => {
    if (timeLeft <= 0 && invite) {
      const destination = `/api/v2/invites/${invite.inviteUuid}/decline`;
      sendMessage(destination, null);
      setInvite(null);
      navigate("/");
    }
  }, [timeLeft, invite, navigate, setInvite, sendMessage]);

  const handleCancel = () => {
    const destination = `/api/v2/invites/${invite.inviteUuid}/decline`;
    sendMessage(destination, null);
    setInvite(null);
    navigate("/");
  };

  if (!invite) return null;

  return (
    <main className="invite-waiting">
      <div className="waiting-card">
        <h2>Aguardando resposta...</h2>
        <p>Você convidou <strong>{invite.invitedUsername}</strong> para jogar.</p>

        <Spinner size="xl" thickness="4px" speed="0.7s" className="loader"/>

        <p className="timer">Tempo restante: {timeLeft}s</p>

        <button className="cancel-btn" onClick={handleCancel}>
          Cancelar convite
        </button>
      </div>
    </main>
  );
};

export default InviteWaiting;
