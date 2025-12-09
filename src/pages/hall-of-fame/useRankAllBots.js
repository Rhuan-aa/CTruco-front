import useAxiosPrivate from "../../hooks/api/useAxiosPrivate";

const useRankAllBots = () => {
  const axiosPrivate = useAxiosPrivate();
  const rankAvailableOnes = async () => {
    try {
      const url = `/api/v1/bots/rank`;
      const response = await axiosPrivate.post(url);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return rankAvailableOnes;
};

export default useRankAllBots;
