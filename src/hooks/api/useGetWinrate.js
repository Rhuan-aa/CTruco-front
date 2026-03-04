import useAxiosPrivate from "../../hooks/api/useAxiosPrivate";

const useGetWinrate = () => {
  const axiosPrivate = useAxiosPrivate();
  const findPlayersWinrate = async () => {
    try {
      const url = `/api/v1/users/winrate`;
      const response = await axiosPrivate.get(url);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return findPlayersWinrate;
};

export default useGetWinrate;
