import React, { MutableRefObject, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthClient } from "../../api/authClient";
import { handleAlertMessage } from "../../utils/auth";
import { Spinner } from "../Spinner/Spinner";
import './styles.css';

export const AuthPage = ({ type }: { type: 'registration' | 'login'; }) => {
    const [spinner, setSpinner] = useState(false);
    const usernameInput = useRef() as MutableRefObject<HTMLInputElement>
    const passwordInput = useRef() as MutableRefObject<HTMLInputElement>
    const currentAuthTitle = type === 'login' ? 'Войти' : 'Регистрация';
    const navigate = useNavigate();

    const loginUser = async (username: string, password: string) => {
        if (!username || !password) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Заполните все поля!', alertStatus: 'warning' });
            return;
        }
        const result = await AuthClient.login(username, password);

        if (!result) {
            setSpinner(false);
            return;
        } else {            
            usernameInput.current.value = '';
            passwordInput.current.value = '';

            navigate('/costs');
            handleAlertMessage({ alertText: 'Вход выполнен!', alertStatus: 'success' });
        }
    }

    const createUser = async (username: string, password: string) => {
        if (!username || !password) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Заполните все поля!', alertStatus: 'warning' });
        } else if (password.length < 4) {
            setSpinner(false);
            handleAlertMessage({ alertText: 'Пароль должен содеражать больше 4 смволов!', alertStatus: 'warning' });
        } else {
            const result = await AuthClient.registration(username, password);

            if (!result) {
                setSpinner(false);
                return;
            }

            usernameInput.current.value = '';
            passwordInput.current.value = '';
            navigate('/login');
            handleAlertMessage({ alertText: 'Регистрация выполнена!', alertStatus: 'success' });
        }
    }

    const authUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSpinner(true);

        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        switch (type) {
            case 'login':
                loginUser(username, password);
                break;
            case 'registration':
                createUser(username, password);
                break;
            default:
                break;
        }
    }

    return (
        <div className='container'>
            <h2>{currentAuthTitle}</h2>
            <form onSubmit={authUser} className='form-group'>
                <label className='auth__label'>
                    Введите имя пользователя
                    <input ref={usernameInput} className='form-control' type="text"/>
                </label>

                <label className='auth__label'>
                    Введите пароль
                    <input autoComplete="off" ref={passwordInput} className='form-control' type="password"/>
                </label>
                <button className='btn btn-primary auth-btn'>
                {spinner ? <Spinner top={5} left={20} /> : currentAuthTitle}
                </button>
            </form>
            {type === 'login' 
            ? <div>
                <span className='question__text'>Еще нет аккаунта?</span>
                <Link to='/registration'>Зарегестрироваться</Link>
            </div>
            : <div>
                <span className='question__text'>Уже есть аккаунт?</span>
                <Link to='/login'>Войти.</Link>
            </div>}
        </div>
    );
}

export default AuthPage;
