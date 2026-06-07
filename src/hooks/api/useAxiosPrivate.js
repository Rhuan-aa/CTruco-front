import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import useAuth from "../context/useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
    const { refresh } = useRefreshToken()
    const { auth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = auth?.token
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config
                const isRequestTokenRequest = prevRequest?.url === '/api/v1/refresh-token'

                if (isRequestTokenRequest) {
                    navigate('/login', { state: { from: location }, replace: true })
                    return Promise.reject(error);
                }

                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = newAccessToken;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh, location, navigate])

    return axiosPrivate;
}

export default useAxiosPrivate;