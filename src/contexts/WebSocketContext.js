import { useState, createContext, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";

const WebSocketContext = createContext({
  client: null,
  isConnected: false,
  sendMessage: () => {},
  subscribe: (topic, callback) => {},
  unsubscribe: () => {},
});

export const WebSocketContextProvider = ({ children }) => {
  const clientRef = useRef(null);
  const subscriptionsRef = useRef(new Map());
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (clientRef.current && clientRef.current.active) {
      return;
    }

    const newClient = new Client({
      brokerURL: "ws://localhost:8080/ws-handshake",
      onConnect: () => {
        setIsConnected(true);
        // subscriptionsRef.current.forEach((sub) => {});
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame);
      },
      reconnectDelay: 5000,
    });

    newClient.activate();
    clientRef.current = newClient;
    const currentSubscriptions = subscriptionsRef.current

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
      setIsConnected(false);
      currentSubscriptions.clear();
    };
  }, []);

  const subscribe = useCallback(
    (topic, callback) => {
      if (!clientRef.current || !isConnected) {
        console.warn("Cliente não conectado, inscrição adiada.");
        return;
      }

      if (subscriptionsRef.current.has(topic)) {
        console.warn(`Já inscrito no tópico: ${topic}`);
        return;
      }

      console.log(`Inscrevendo no tópico: ${topic}`);
      const newSubscription = clientRef.current.subscribe(topic, (message) => {
        callback(message);
          
      });
      subscriptionsRef.current.set(topic, newSubscription);
      console.log(`Inscrito no novo tópico: ${topic}`);
    },
    [isConnected]
  );

  const unsubscribe = useCallback((topic) => {
    if (!subscriptionsRef.current.has(topic)) {
      console.warn(`Não está inscrito no tópico: ${topic}`);
      return;
    }

    console.log(`Cancelando inscrição do tópico: ${topic}`);
    const subscription = subscriptionsRef.current.get(topic);
    subscription.unsubscribe();

    subscriptionsRef.current.delete(topic);
  }, []);

  const sendMessage = (destination, body) => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    } else {
      console.warn(
        "Cliente STOMP não está conectado para enviar:",
        destination
      );
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ clientRef, isConnected, sendMessage, subscribe, unsubscribe }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
