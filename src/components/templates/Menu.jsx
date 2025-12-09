import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Accordion from "../../pages/utils/Accordion";
import useDeleteGame from "../../hooks/api/useDeleteGame";
import useRefreshToken from "../../hooks/api/useRefreshToken";
import useIntel from "../../hooks/context/useIntel";
import useTournamentStatus from "../../pages/context/useTournamentStatus";
import "./Menu.css";

const Menu = () => {
  const { intel, setIntel } = useIntel();
  const deleteConcludedGame = useDeleteGame();
  const { deleteTokens } = useRefreshToken();
  const [logged, setLogged] = useState(true);
  const { championship, setChampionship } = useTournamentStatus();

  const handleNewGameSelection = () => {
    if (!intel) setIntel({});
  };

  const handleLogout = (event) => {
    event.preventDefault();
    const hasActiveGame = !!intel && Object.keys(intel).length > 0;
    if (hasActiveGame) deleteConcludedGame();
    deleteTokens();
    setLogged(false);
  };

  return !logged ? (
    <Navigate to="/login" />
  ) : (
    <nav className="menu-area">
      <Accordion
        title="Jogar"
        content={
          <>
            <Link
              className="accordion-link"
              to="/mat/start-game"
              onClick={handleNewGameSelection}
            >
              <i className="bi bi-geo-fill" /> Partida Única{" "}
            </Link>

            <Link className="accordion-link" to="/simulate-bots">
              <i className="bi bi-robot" /> Bot vs Bot{" "}
            </Link>

            <Link
              className="accordion-link"
              to={championship ? "/tournament" : "/tournament/config"}
            >
              <i className="bi bi-trophy" /> Campeonato{" "}
            </Link>
          </>
        }
      />
      <Link to="/evaluate-bot">
        {/* <i style={{ paddingRight: "0px" }} className="bi bi-graph-up" /> Avaliar
        Bot{" "} */}
        <i style={{ paddingRight: "0px" }} className="bi bi-activity" /> Avaliar
        Bot{" "}
      </Link>
      <Link to="/user-history">
        <i style={{ paddingRight: "0px" }} className="bi bi-clock-history" />{" "}
        Histórico de Partidas{" "}
      </Link>
      <Accordion
        title="Hall da Fama"
        content={
          <>
            <Link className="accordion-link" to="/hall-of-fame">
              <i style={{ fontStyle: "normal" }} className="bi bi-gem" />{" "}
              Ranking dos Bots
            </Link>
            <Link className="accordion-link" to="/top-winners">
              <i
                style={{ fontStyle: "normal" }}
                className="bi bi-trophy-fill"
              />{" "}
              Ranking de Jogadores
            </Link>
          </>
        }
      />
      <Link to="/add-remote">
        <i className="bi bi-plus-circle" />
        Bots Remotos
      </Link>
      <Link to="/" onClick={handleLogout}>
        <i style={{ paddingRight: "0px" }} className="bi bi-box-arrow-left" />{" "}
        Sair{" "}
      </Link>
    </nav>
  );
};
export default Menu;
