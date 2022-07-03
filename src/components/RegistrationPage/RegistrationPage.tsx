import React, { MutableRefObject, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthClient } from "../../api/authClient";
import { handleAlertMessage } from "../../utils/auth";
import './styles.css';

export const RegistrationPage = () => {
    const usernameInput = useRef() as MutableRefObject<HTMLInputElement>
    const passwordInput = useRef() as MutableRefObject<HTMLInputElement>
    const navigate = useNavigate();

    const createUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const username = usernameInput.current.value;
        const password = passwordInput.current.value;

        if (!username || !password) {
            handleAlertMessage({ alertText: 'Заполните все поля!', alertStatus: 'warning' });
        } else if (password.length < 4) {
            handleAlertMessage({ alertText: 'Пароль должен содеражать больше 4 смволов!', alertStatus: 'warning' });
        } else {
            const result = await AuthClient.registration(username, password);

            if (!result) {
                return;
            }
                
            usernameInput.current.value = '';
            passwordInput.current.value = '';
            navigate('/login');
            handleAlertMessage({ alertText: 'Регистрация выполнена!', alertStatus: 'success' });
        }
    }

    return (
        <div className='container'>
            <h2 className='registration__title'>Регистрация</h2>
            <form onSubmit={createUser} className='form-group'>
                <label className='registration__label'>
                    Введите имя пользователя
                    <input ref={usernameInput} className='form-control' type="text"/>
                </label>

                <label className='registration__label'>
                    Введите пароль
                    <input autoComplete="off" ref={passwordInput} className='form-control' type="password"/>
                </label>
                <button className='btn btn-primary'>Создать</button>
            </form>
            <div className='registration__question'>
                <span className='question__text'>Уже есть аккаунт?</span>
                <Link to='/login'>Войти.</Link>
            </div>
        </div>
    );
}
