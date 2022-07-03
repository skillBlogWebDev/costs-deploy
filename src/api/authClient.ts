import api from './axiosClient';
import { setAuth, setAuthData } from '../context/auth';
import { handleAxiosError } from "../utils/errors";

export class AuthClient {
    static async login(username: string, password: string) {
        try {
            const result = await api.post('https://protected-beach-61085.herokuapp.com/auth/login', { username, password });

            if (result.status === 200) {
                setAuth(true);
                setAuthData(result.data.username);
                localStorage.setItem('auth', JSON.stringify(result.data));
                return true;
            }

            return false;
        } catch (error) {
            handleAxiosError(error);
        }
    }

    static async registration(username: string, password: string) {
        try {
            const result = await api.post('/auth/registration', { username, password });
            
            if (result.status === 201) {
                setAuth(false);
                return true;
            }

            return false;
        } catch (error) {
            handleAxiosError(error);
        }
    }
}