import useAxiosPrivate from "../../hooks/api/useAxiosPrivate";
import useAuth from "../../hooks/context/useAuth";

const useUserMatchHistory = () => {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate()
  const getHistory = async () => {
    try {
      const url = `/api/v1/games/players/${auth.uuid}/match-history`;
      const response = await axiosPrivate.get(url);
      return response.data.games;
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return getHistory;
};

export default useUserMatchHistory;
