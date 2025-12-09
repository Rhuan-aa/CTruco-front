import useAxiosPrivate from "../../hooks/api/useAxiosPrivate";

const useTopWinners = () => {
  const axiosPrivate = useAxiosPrivate();
  const findTopWinners = async () => {
    try {
      const url = `/api/v1/users/top-winners`;
      const response = await axiosPrivate.get(url);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return findTopWinners;
};

export default useTopWinners;
