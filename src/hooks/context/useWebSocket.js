import { useContext } from 'react';

import WebSocketContext from '../../contexts/WebSocketContext'; 

const useWebSocket = () => {
    return useContext(WebSocketContext);
}

export default useWebSocket;