import useAuth from "../context/useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useGetOnlinePlayers = () => {
    const axiosPrivate = useAxiosPrivate();
    const { auth: { uuid } } = useAuth()

    const getOnlinePlayers = async () => {
        try {
            const { data: players } = await axiosPrivate.get(`/api/v2/invites/online-players/${uuid}`);
            return players;
        } catch (error) {
            console.error("Erro ao buscar jogadores online", error);
            return { data: [] };
        }
    };

    return getOnlinePlayers;
};

export default useGetOnlinePlayers;