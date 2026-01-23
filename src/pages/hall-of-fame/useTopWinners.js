import useAxiosPrivate from "../../hooks/api/useAxiosPrivate";

const useTopWinners = () => {
  const axiosPrivate = useAxiosPrivate();
  const findTopWinners = async () => {
    try {
      const url = `/api/v1/reports/top-winners/5`;
      const response = await axiosPrivate.get(url);
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  return findTopWinners;
};

export default useTopWinners;
