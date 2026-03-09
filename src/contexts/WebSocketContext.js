import { useState, createContext, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import { BROKER_URL } from "../api/broker";

const WebSocketContext = createContext({
    client: null,
    isConnected: false,
    sendMessage: () => { },
    subscribe: (topic, callback) => { },
    unsubscribe: () => { },
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
            brokerURL: BROKER_URL,
            onConnect: () => {
                setIsConnected(true);
            },
            onDisconnect: () => {
                setIsConnected(false);
                subscriptionsRef.current.forEach((subscription, topic) => {
                    subscription.unsubscribe();
                });

                subscriptionsRef.current.clear();
            },
            onStompError: (frame) => {
                console.error("Erro STOMP:", frame);
            },
            reconnectDelay: 5000,
        });

        newClient.activate();
        clientRef.current = newClient;
        const currentSubscriptions = subscriptionsRef.current;

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
                return;
            }

            if (subscriptionsRef.current.has(topic)) {
                return;
            }

            const newSubscription = clientRef.current.subscribe(topic, (message) => {
                callback(message);
            });
            subscriptionsRef.current.set(topic, newSubscription);
        },
        [isConnected],
    );

    const unsubscribe = useCallback((topic) => {
        if (!subscriptionsRef.current.has(topic)) {
            return;
        }

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
                destination,
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
