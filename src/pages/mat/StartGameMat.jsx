import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OpponentsTable from "./OpponentsTable";
import useCreateGame from "../../hooks/api/useCreateGame";
import useIntel from "../../hooks/context/useIntel";
import { ChakraProvider, Input } from "@chakra-ui/react";
import useGetBotNames from "../../hooks/api/useGetBotNames";
import useGetOnlinePlayers from "../../hooks/api/useGetOnlinePlayers";
import useInvitePlayer from "../../hooks/api/useInvitePlayer";
import "./StartGameMat.css";
import useGetRank from "../hall-of-fame/useGetRank";

const StartGameMat = () => {
  const { intel } = useIntel();
  const navigate = useNavigate();
  const containerRef = useRef();
  const invite = useInvitePlayer();

  const [botsList, setBotsList] = useState([]); 
  const [playersList, setPlayersList] = useState([]);
  const [combinedList, setCombinedList] = useState([]);

  const [selectedOpponentName, setSelectedOpponentName] = useState("MineiroByBueno");

  const createWithBot = useCreateGame();
  const fetchBotNames = useGetBotNames();
  const fetchOnlinePlayers = useGetOnlinePlayers();
  const fetchBotRanks = useGetRank();

  const updateLists = async () => {
    const botResponse = await fetchBotNames();
    const namesList = botResponse.data ? botResponse.data.sort() : [];

    let ranksList = [];
    try {
        const payload = await fetchBotRanks();
        if (payload && Array.isArray(payload.rank)) {
            ranksList = payload.rank;
        }
    } catch (error) {
        console.warn("Ranking indisponível:", error);
    }

    const enrichedBots = namesList.map(botNameString => {
        const rankData = ranksList.find(r => r.botName === botNameString);

        return {
            name: botNameString,
            score: rankData ? rankData.botWins : 0 
        };
    });

    setBotsList(enrichedBots);
    const playerResponse = await fetchOnlinePlayers();
    if (playerResponse) setPlayersList(playerResponse);
  };

  const mergeLists = (bots, players) => {
    const botsFormatted = bots.map((b) => ({
      name: b.name,
      type: "bot",
      score: b.score 
    }));

    const playersFormatted = players.map((p) => ({
      name: p.username,
      type: "player",
      playerUuid: p.playerUuid,
      score: p.score
    }));

    setCombinedList([...playersFormatted, ...botsFormatted]);
  };

  useEffect(() => {
    updateLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mergeLists(botsList, playersList);
  }, [botsList, playersList]);

  const handleInputChange = (target) => {
    const content = target.value.toLowerCase();
    const combined = [
      ...playersList.map((p) => ({
        name: p.username,
        type: "player",
        playerUuid: p.playerUuid,
        score: p.score
      })),
      ...botsList.map((b) => ({
        name: b.name,
        type: "bot",
        score: b.score
      })),
    ];

    const filtered = combined.filter((item) =>
      item.name.toLowerCase().includes(content)
    );
    setCombinedList(filtered);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selected = combinedList.find((i) => i.name === selectedOpponentName);
    
    if (!selected) return;
    
    if (selected.type === "player") {
      await invite(selected.playerUuid);
    } else {
      await createWithBot(selected.name);
      navigate("/mat/game");
    }
  };

  useEffect(() => {
    if (intel && intel.last) {
      navigate("/mat/game");
    }
  }, [intel, navigate]);

  return (
    <main className="choose-opponent cs-feat">
      <form onSubmit={handleSubmit}>
        <p className="fs-5 mb-0 text-center">Nova partida</p>
        <div className="mb-3 mt-4">
          <label htmlFor="inputOpponent" className="form-label">
            Escolha o oponente
          </label>

          <ChakraProvider>
            <Input
              className="filter"
              ref={containerRef}
              type="text"
              onChange={(e) => handleInputChange(e.target)}
              placeholder="Busque pelo nome"
            />

            <div className="start-game-mat-table mt-2">
              <OpponentsTable
                selectedOpponent={selectedOpponentName}
                setSelectedOpponent={setSelectedOpponentName}
                opponents={combinedList}
              />
            </div>
          </ChakraProvider>
        </div>

        <button
          type="submit"
          className="btn w-100 btn-dark"
        >
          Jogar X {selectedOpponentName}
        </button>
      </form>
    </main>
  );
};

export default StartGameMat;