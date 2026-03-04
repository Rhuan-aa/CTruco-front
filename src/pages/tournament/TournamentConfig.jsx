import React, { useEffect, useState } from "react";
import { ChakraProvider, Input } from "@chakra-ui/react";
import TransferListFragment from "./TransferListFragment";
import "./TournamentConfig.css";
import useGetBotNames from "../../hooks/api/useGetBotNames";
import useTournamentStatus from "../context/useTournamentStatus";
import useCreateTournament from "./useCreateTournament";
import { useNavigate } from "react-router-dom";

const TournamentConfig = () => {
  const [l1Bots, setL1Bots] = useState([]);
  const [l2Bots, setL2Bots] = useState([]); 
  
  const [selectedL1, setSelectedL1] = useState([]);
  const [selectedL2, setSelectedL2] = useState([]);

  const {
    championship,
    setChampionship,
    setFinalMatchTimes,
    times,
    setTimes,
    setTitle,
  } = useTournamentStatus();
  
  const fetchBotNames = useGetBotNames();
  const createTournament = useCreateTournament();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBots = async () => {
        const response = await fetchBotNames();
        const data = await response.data.sort();
        setL1Bots(data);
    };
    
    if (championship) navigate("/tournament", {});
    
    setTimes(31);
    setFinalMatchTimes(31);
    setTitle("");
    loadBots();
  }, []);

  const moveRight = () => {
    if (selectedL1.length === 0) return;
    
    const newL2 = [...l2Bots, ...selectedL1].sort();
    const newL1 = l1Bots.filter(bot => !selectedL1.includes(bot)).sort();
    
    setL1Bots(newL1);
    setL2Bots(newL2);
    setSelectedL1([]);
  };

  const moveLeft = () => {
    if (selectedL2.length === 0) return;

    const newL1 = [...l1Bots, ...selectedL2].sort();
    const newL2 = l2Bots.filter(bot => !selectedL2.includes(bot)).sort();

    setL1Bots(newL1);
    setL2Bots(newL2);
    setSelectedL2([]); 
  };

  const createCamp = async () => {
    let camp = await createTournament(l2Bots, times, 31); 
    setChampionship(camp);
    navigate("/tournament");
  };

  return (
    <main className="tournament-config">
      <section className="config-container">
        
        <div className="column-list">
             <label>Disponíveis</label>
             <TransferListFragment
                content={l1Bots}
                selectedItems={selectedL1}
                setSelectedItems={setSelectedL1}
             />
        </div>

        <div className="column-center">
            
            <div className="transfer-buttons">
                <button 
                    className="btn btn-dark" 
                    onClick={moveRight} 
                    disabled={selectedL1.length === 0}
                    title="Mover para o Torneio"
                >
                    Mover &gt;
                </button>
                <button 
                    className="btn btn-dark" 
                    onClick={moveLeft} 
                    disabled={selectedL2.length === 0}
                    title="Remover do Torneio"
                >
                    &lt; Voltar
                </button>
            </div>

            <ChakraProvider>
                <div className="form-inputs">
                    <label>Título do torneio</label>
                    <Input onChange={(e) => setTitle(e.target.value)} size="sm" />
                    
                    <label>Simulações</label>
                    <Input 
                        type="number" 
                        onChange={(e) => setTimes(e.target.value)} 
                        placeholder="31" 
                        size="sm"
                    />
                </div>
            </ChakraProvider>

            <div className="submit-area">
                <p style={{ color: "red", fontSize: "12px" }} hidden={l2Bots.length === 8 || l2Bots.length === 16}>
                    Necessário 8 ou 16 bots
                </p>
                <button
                    className="btn btn-success"
                    onClick={(e) => { e.preventDefault(); createCamp(); }}
                    disabled={l2Bots.length !== 8 && l2Bots.length !== 16}
                >
                    Começar Torneio
                </button>
            </div>
        </div>

        <div className="column-list">
            <label>Participantes</label>
            <TransferListFragment
                content={l2Bots}
                selectedItems={selectedL2}
                setSelectedItems={setSelectedL2}
            />
        </div>

      </section>
    </main>
  );
};

export default TournamentConfig;