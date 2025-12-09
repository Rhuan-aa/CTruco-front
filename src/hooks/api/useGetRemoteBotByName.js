import useAxiosPrivate from "./useAxiosPrivate";

const useGetRemoteBotByName = () => {
  const axiosPrivate = useAxiosPrivate();

  const getOne = async (botName) => {
    try {
      const url = `/api/v1/remote-bots/${botName}`;
      const response = await axiosPrivate.get(url);
      return response.data;
    } catch (error) {
      console.log(error.response.headers.authorization);
    }
  };
  return getOne;
};

export default useGetRemoteBotByName;
