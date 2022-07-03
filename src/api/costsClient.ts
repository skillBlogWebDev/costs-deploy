import { createEffect } from "effector";
import { ICreateCostFx, IDeleteCostsFx, IGetCostsFx, IRefreshTokenFx, IUpdateCostsFx } from '../types/index';
import { handleAxiosError } from "../utils/errors";
import api from './axiosClient';
import { getAuthDataFromLS, setAuthDataToLS, removeUser } from '../utils/auth';

export const createCostFx = createEffect(async ({ url, cost, token }: ICreateCostFx) => {
    try {
        const { data } = await api.post(`https://protected-beach-61085.herokuapp.com${url}`, { ...cost }, { headers: { 'Authorization': `Bearer ${token}` } });        
        
        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'create', createCost: { url, cost } })
    }
});

export const getCostsFx = createEffect(async ({ url, token }: IGetCostsFx) => {
    try {
        const { data } = await api.get(`https://protected-beach-61085.herokuapp.com${url}`, { headers: { 'Authorization': `Bearer ${token}` } });

        return data;
    } catch (error) {
        handleAxiosError(error, { type: 'get', getCosts: { url } });
    }
});

export const updateCostsFx = createEffect(async ({ url, token, cost, id }: IUpdateCostsFx) => {
    try {
        const { data } = await api.patch(`https://protected-beach-61085.herokuapp.com${url}/${id}`, { ...cost }, { headers: { 'Authorization': `Bearer ${token}` } });        

        return data;
    } catch (error) {        
        handleAxiosError(error, { type: 'update', updateCosts: { url, cost, id } });
    }
});

export const deleteCostsFx = createEffect(async ({ url, token, id }: IDeleteCostsFx) => {
    try {
        await api.delete(`https://protected-beach-61085.herokuapp.com${url}/${id}`, { headers: { 'Authorization': `Bearer ${token}` }});
    } catch (error) {
        handleAxiosError(error, { type: 'delete', deleteCost: { url, id } });
    }
});

export const refreshTokenFx = createEffect(async ({ url, token, username }: IRefreshTokenFx) => {
    try {
        const result = await api.post(url, { refresh_token: token, username });

        if (result.status === 200) {
            const authData = getAuthDataFromLS();

            setAuthDataToLS(
                JSON.stringify({
                    ...result.data,
                    username: authData.username,
                })
            )

            getCostsFx({
                url: '/cost',
                token: result.data.access_token
            });

            return result.data.access_token;
        } else {
            removeUser();
        }
        
    } catch (error) {
        handleAxiosError(error);
    }
});
