import { useState } from 'react'
import axios from '../../api/axios'

const useSignUp = () => {
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState([]);

    const signUp = async (payload) => {
        setSuccess(false);
        setErrors([]);

        try {
            await axios.post(`/register`, payload)
            setSuccess(true)
        } catch (error) {
            if (error.response?.data?.message) {
                setErrors([error.response.data.message]);
            } else if (error.response?.data && typeof error.response.data === 'string') {
                setErrors([error.response.data]);
            } else if (error.response?.data?.ErrorDescription) {
                setErrors([error.response.data.ErrorDescription]);
            } else {
                setErrors(["Erro ao tentar comunicar com o servidor."]);
            }
        }
    }
    
    return [signUp, success, errors]
}

export default useSignUp

