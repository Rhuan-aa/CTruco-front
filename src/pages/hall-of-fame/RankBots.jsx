import React, { useEffect, useState } from "react";
import { ChakraProvider, Spinner } from "@chakra-ui/react";
import useRankAllBots from "./useRankAllBots";
import useGetRank from "./useGetRank";
import "../home/Home.css";
import "./RankBots.css";

const RankBots = () => {
  const [rank, setRank] = useState([]);
  const [numberOfGames, setNumberOfGames] = useState(0);
  const rankAvailableOnes = useRankAllBots();
  const getFromDB = useGetRank();

  const updateRank = async () => {
    let payload = await getFromDB();
    setNumberOfGames(payload.numberOfGames);
    if (payload.rank.length > 0) {
      setRank(payload.rank);
    }
  };

  useEffect(() => {
    updateRank();

    const interval = setInterval(() => {
      updateRank();
    }, 90000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main id="bots-rank" className="cs-feat">
      <section>
        <div className="section-header">
          <p className="fs-5 mb-0 text-center">Colocação Atual</p>
        </div>
        {rank.length === 0 && (
          <div className="mb-3 mt-4 spinner-container">
            <ChakraProvider>
              <p style={{ margin: "0px" }}>
                Ops! O ranking de bots não está disponível no momento.
              </p>
              <p style={{ margin: "0px" }}>Tente mais tarde.</p>
            </ChakraProvider>
          </div>
        )}
        {rank.length > 0 && (
          <div className="section-content mb-3 mt-4">
            <div className="table-limiter">
              <table className="default-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th className="default-th">Rank</th>
                    <th className="default-th">Bot</th>
                    <th className="default-th">Vitórias</th>
                  </tr>
                </thead>
                <tbody className="default-tbody">
                  {rank.map((bot) => {
                    return (
                      <tr key={bot.botName}>
                        <td className="default-td">{bot.botRank}</td>
                        <td className="default-td">{bot.botName}</td>
                        <td className="default-td">
                          {bot.botWins} / {numberOfGames}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default RankBots;
