import { createContext, useState } from "react";

const InviteContext = createContext();

export const InviteContextProvider = ({children}) => {
    const [invite , setInvite] = useState();

    return (
        <InviteContext.Provider value={{ invite, setInvite }}>
            {children}
        </InviteContext.Provider>
    )
}

export default InviteContext;