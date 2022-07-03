import { setCosts } from "../context";
import { setAuth, setAuthData } from "../context/auth";
import { IAlert } from '../types/index';
import { setAlert } from '../context/alert';

export const removeUser = () => {
    localStorage.removeItem('auth');
    setAuth(false);
    setAuthData('');
    setCosts([]);
}

export const getAuthDataFromLS = () => {
    try {
        const authData = JSON.parse(localStorage.getItem('auth') as string);
        
    if (!authData) {
        removeUser();
        return;
    }

    return authData;
    } catch (error) {
        removeUser();
    }
}

export const setAuthDataToLS = (data: string) => {
    localStorage.setItem('auth', data);
}

export const handleAlertMessage = (alert: IAlert) => {
    setAlert(alert);
    setTimeout(() => setAlert({ alertText: '', alertStatus: '' }), 3000);
}
