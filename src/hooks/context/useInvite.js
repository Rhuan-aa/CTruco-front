import { useContext } from "react";
import InviteContext from "../../contexts/InviteContext";

const useInvite = () => {
    return useContext(InviteContext)
}

export default useInvite