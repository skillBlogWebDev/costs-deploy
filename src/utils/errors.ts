import { AxiosError } from "axios";
import { refreshTokenFx, deleteCostsFx, createCostFx, getCostsFx, updateCostsFx } from '../api/costsClient';
import { createCost, setCosts, updateCost } from "../context";
import { ICost, IHandleAxiosErrorPayload } from "../types";
import { getAuthDataFromLS, handleAlertMessage, removeUser } from "./auth";

export const handleAxiosError = async (
    error: unknown, 
    payload: IHandleAxiosErrorPayload | null = null
) => {
    const errorMessage = 
    ((error as AxiosError).response?.data as { message: string }).message ||
    ((error as AxiosError).response?.data as { error: string }).error

    if (errorMessage) {
        if (errorMessage === 'jwt expired') {
            const payloadData = payload as IHandleAxiosErrorPayload;
            const authData = getAuthDataFromLS();
            
            refreshTokenFx({
                url: '/auth/refresh',
                token: authData.refresh_token,
                username: authData.username
            });

            if (payload !== null) {
                switch (payloadData.type) {
                    case 'delete':
                        await deleteCostsFx({
                            url: '/cost',
                            token: authData.access_token,
                            id: payloadData.deleteCost?.id as string
                        });
                        break;
                    case 'create':
                        const createCostObj = payloadData.createCost?.cost as ICost

                        const cost = await createCostFx({
                            url: '/cost',
                            cost: {
                                text: createCostObj.text as string,
                                price: createCostObj.price as number,
                                date: createCostObj.date as string | Date
                            },
                            token: authData.access_token
                        });

                        if (!cost) {
                            return;
                        }
                        
                        createCost(cost);
                        break;
                    case 'update': {
                        const updateCostObj = payloadData.updateCosts?.cost as ICost

                        const cost = await updateCostsFx({
                            url: '/cost',
                            cost: {
                                text: updateCostObj.text as string,
                                price: updateCostObj.price as number,
                                date: updateCostObj.date as string | Date
                            },
                            token: authData.access_token,
                            id: payload.updateCosts?.id as string
                        });

                        if (!cost) {
                            return;
                        }
                        
                        updateCost(cost);
                        break;
                    }
                    case 'get':
                        const costs = await getCostsFx({
                            url: '/cost',
                            token: authData.access_token
                        });

                        setCosts(costs);
                        break;    
                    default:
                        break;
                }
            }
        } else {
            handleAlertMessage({ alertText: errorMessage, alertStatus: 'warning' });
            removeUser()
        }
    } else {
        handleAlertMessage({ alertText: errorMessage, alertStatus: 'warning' });
    }
}
