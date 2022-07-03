import { createDomain } from "effector";
import { ICost } from '../types/index';

const costs = createDomain();

export const setCosts = costs.createEvent<ICost[]>();
export const createCost = costs.createEvent<ICost>();
export const updateCost = costs.createEvent<ICost>();
export const remove = costs.createEvent<number | string>();
export const setTotalPrice = costs.createEvent<number>();

export const update = (
    costs: ICost[], 
    id: string | number, 
    text: string, 
    price: number,
    date: Date | string
): ICost[] => costs.map((cost) => {        
    if (cost._id === id) {
        return {
            ...cost,
            text,
            price,
            date
        }
    }

    return cost
})

export const removeCost = (
    costs: ICost[], 
    id: number | string
): ICost[] => costs.filter((cost) => cost._id !== id);

export const $totalPrice = costs.createStore<number>(0)
    .on(setTotalPrice, (_, value) => value);

export const $costs = costs.createStore<ICost[]>([])
    .on(createCost, (state, cost) => [...state, cost])
    .on(updateCost, (state, cost) => [
        ...update(state, cost._id as string, cost.text, cost.price, cost.date)
    ])
    .on(remove, (state, id) => [
      ...removeCost(state, id),
    ])
    .on(setCosts, (_, value) => value);
