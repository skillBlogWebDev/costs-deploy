import React, { MutableRefObject, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthClient } from "../../api/authClient";
import { handleAlertMessage } from "../../utils/auth";
import { Spinner } from "../Spinner/Spinner";
import './styles.css';

export const LoginPage = () => {
    const [spinner, setSpinner] = useState(false);
    const usernameInput = useRef() as MutableRefObject<HTMLInputElement>
    const passwordInput = useRef() as MutableRefObject<HTMLInputElement>
    const navigate = useNavigate();

    const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSpinner(true);

        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            handleAlertMessage({ alertText: 'Заполните все поля!', alertStatus: 'warning' });
            return;
        }
        const result = await AuthClient.login(username, password);

        if (!result) {
            return;
        } else {            
            usernameInput.current.value = '';
            passwordInput.current.value = '';

            navigate('/costs');
            handleAlertMessage({ alertText: 'Вход выполнен!', alertStatus: 'success' });
        }

        setSpinner(false);
    }

    return (
        <div className='container'>
            <h2 className='login__title'>Вход</h2>
            <form onSubmit={loginUser} className='form-group'>
                <label className='login__label'>
                    Введите имя пользователя
                    <input ref={usernameInput} className='form-control' type="text"/>
                </label>

                <label className='login__label'>
                    Введите пароль
                    <input autoComplete="off" ref={passwordInput} className='form-control' type="password"/>
                </label>
                <button className='btn btn-primary login-btn'>
                {spinner ? <Spinner top={5} left={20} /> : 'Войти'}
                </button>
            </form>
            <div className='login__question'>
                <span className='question__text'>Еще нет аккаунта?</span>
                <Link to='/registration'>Зарегестрироваться</Link>
            </div>
        </div>
    );
}

export default LoginPage;
