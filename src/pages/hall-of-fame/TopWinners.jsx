import React, { useEffect, useState } from "react";
import { ChakraProvider, Spinner } from "@chakra-ui/react";
import useTopWinners from "./useTopWinners";
import "../home/Home.css";
import "./TopWinners.css";

const TopWinners = () => {
  const findTopWinners = useTopWinners();
  const [playersRank, setPlayersRank] = useState(null);

  const updateWinnersTable = async () => {
    let response = await findTopWinners();
    console.log(response);

    if (response && response.topWinners) {
      setPlayersRank(response.topWinners);
    }
  };

  useEffect(() => {
    updateWinnersTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main id="top-winners-main" className="cs-feat">
      <section>
        <div className="section-header">
          <ChakraProvider>
            <button
              className="btn btn-dark"
              style={{ width: "fit-content" }}
              onClick={() => updateWinnersTable()}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </ChakraProvider>
          <p className="fs-5 mb-0 text-center">Colocação Atual</p>
        </div>

        {!playersRank && (
          <ChakraProvider>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="black"
              size="xl"
              className="spinner"
            />
            <p>Isso pode demorar um pouco...</p>
          </ChakraProvider>
        )}

        {playersRank && (
          <div className="top-winners-limiter mb-3 mt-4">
            <table className="default-table">
              <thead>
                <tr>
                  <th className="default-th">#</th>
                  <th className="default-th">Jogador</th>
                  <th className="default-th">Winrate %</th>
                  <th className="default-th">Vitórias</th>
                  <th className="default-th">Derrotas</th>
                </tr>
              </thead>
              <tbody className="default-tbody">
                {playersRank
                  .sort((a, b) => b.winrate - a.winrate)
                  .map((player, index) => {
                    const losses = player.numberOfMatches - player.wins;
                    const standardWinrate = player.numberOfMatches > 0 
                      ? (player.wins / player.numberOfMatches) * 100 
                      : 0;

                    return (
                      <tr key={index}>
                        <td className="default-td font-weight-bold">
                          {index + 1}º
                        </td>
                        <td className="default-td">{player.name}</td>
                        <td className="default-td">
                          {standardWinrate.toFixed(1)}%
                        </td>
                        <td className="default-td text-success">
                          {player.wins}
                        </td>
                        <td className="default-td text-danger">
                          {losses}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default TopWinners;