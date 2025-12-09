import "./InviteScreen.css";
import useInvite from "../../hooks/context/useInvite";
import useWebSocket from "../../hooks/context/useWebSocket";
import useAuth from "../../hooks/context/useAuth";
import { useNavigate } from "react-router-dom";

const InviteScreen = () => {
    const { invite, setInvite } = useInvite();
    const { auth: { uuid } } = useAuth();
    const { sendMessage } = useWebSocket();
    const navigate = useNavigate();

    if (!invite) {
        return <h3>Nenhum convite pendente.</h3>;
    }

    const handleAccept = () => {
        const destination = `/api/v2/invites/${invite.inviteUuid}/accept`;
        sendMessage(destination, uuid);
        setInvite(null);
        navigate("/");
    };

    const handleDecline = () => {
        const destination = `/api/v2/invites/${invite.inviteUuid}/decline`;
        sendMessage(destination, uuid);
        setInvite(null);
        navigate("/");
    };

    return (
    <main className="invite-screen">
      <div className="invite-card">
        <h2>Convite recebido!</h2>
        <p><strong>{invite.hostUsername}</strong> está te convidando para jogar.</p>

        <div className="invite-actions">
          <button className="invite-btn accept" onClick={handleAccept}>
            Aceitar
          </button>
          <button className="invite-btn reject" onClick={handleDecline}>
            Recusar
          </button>
        </div>
      </div>
    </main>
  );
};

export default InviteScreen;
