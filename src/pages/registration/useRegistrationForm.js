import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignUp from '../../hooks/api/useSignUp'; 

const EMAIL_ERRORS_MAP = [
    { keyword: 'already in use', translation: 'Este e-mail já está registado no sistema.' },
    { keyword: 'Disposable', translation: 'E-mails temporários/descartáveis não são permitidos.' },
    { keyword: 'receiving server', translation: 'O domínio deste e-mail é inválido ou não recebe mensagens.' },
    { keyword: 'inbox', translation: 'A caixa de entrada deste e-mail não existe.' }
];

const useRegistrationForm = (validate) => {
    const navigate = useNavigate();
    const [signUp, success, apiErrors] = useSignUp();
    const [errors, setErrors] = useState({});

    const [values, setValues] = useState({
        username: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (apiErrors.length === 0) return;

        const errorTypes = {};
        const fullErrorMessage = apiErrors.join(" ");
        const errorMessageLower = fullErrorMessage.toLowerCase();

        if (errorMessageLower.includes('username') || errorMessageLower.includes('usuário')) {
            errorTypes.username = "Este nome de utilizador já está em uso.";
        }

        if (errorMessageLower.includes('email') || errorMessageLower.includes('e-mail')) {
            const matchedError = EMAIL_ERRORS_MAP.find(err => fullErrorMessage.includes(err.keyword));
            errorTypes.email = matchedError ? matchedError.translation : 'E-mail inválido ou indisponível.';
        }

        if (!errorTypes.username && !errorTypes.email) {
            errorTypes.apiError = fullErrorMessage;
        }

        setErrors(errorTypes);

    }, [apiErrors]);

    useEffect(() => {
        if (!success) return;
        navigate('/login');
    }, [success, navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value.trim()
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const validationErrors = validate(values);
        setErrors(() => validationErrors);

        if (hasErrors(validationErrors)) return;

        const payload = {
            username: values.username,
            email: values.email,
            password: values.password
        };
        await signUp(payload);
    };

    const hasErrors = validationErrors => Object.keys(validationErrors).length !== 0;

    return { values, errors, handleChange, handleSubmit };
};

export default useRegistrationForm;