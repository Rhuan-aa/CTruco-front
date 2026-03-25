import OpenCards from "../../components/game/cards/OpenCards";
import OpponentHand from "../../components/game/cards/OpponentHand";
import PlayerHand from "../../components/game/cards/PlayerHand";
import Commands from "../../components/game/commands/Commands";
import Message from "../../components/game/mat/Message";
import Rounds from "../../components/game/mat/Rounds";
import Score from "../../components/game/mat/Score";
import useAnimation from "./useAnimation";
import "./GameMat.css";

const Mat = () => {
  const {
    isCurrentPlayer,
    vira,
    message,
    rounds,
    handPoints,
    username,
    playerHand,
    playerCard,
    playerScore,
    opponentName,
    opponentHand,
    opponentCard,
    opponentScore,
    raiseDisabled,
    acceptDisabled,
    quitDisabled,
    raiseLabel,
    quitLabel,
  } = useAnimation();

  return (
    <main className="mat-area">
      <div className={`mat ${!isCurrentPlayer ? 'waiting-turn' : ''}`}>
        
        <div className={`opponent-score ${!isCurrentPlayer ? 'active-turn' : ''}`}>
          <Score player={opponentName} score={opponentScore} position="top" />
        </div>
        <div className={`player-score ${isCurrentPlayer ? 'active-turn' : ''}`}>
          <Score player={username} score={playerScore} position="botton" />
        </div>
        <OpponentHand cards={opponentHand} />
        <OpenCards
          vira={vira}
          playerCard={playerCard}
          opponentCard={opponentCard}
        />
        <PlayerHand cards={playerHand} />
        <Rounds rounds={rounds} points={handPoints} />
        <Commands
          quitLabel={quitLabel}
          quitDisabled={quitDisabled}
          acceptDisabled={acceptDisabled}
          raiseDisabled={raiseDisabled}
          raiseLabel={raiseLabel}
        />
        <Message text={message} />
      </div>
    </main>
  );
};

export default Mat;