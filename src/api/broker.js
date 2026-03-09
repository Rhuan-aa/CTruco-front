const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const BROKER_URL = API_URL.replace(/^http/, "ws") + "/ws-handshake";