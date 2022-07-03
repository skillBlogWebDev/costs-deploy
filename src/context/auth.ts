import { createDomain } from "effector";

const auth = createDomain();

export const setAuth = auth.createEvent<boolean>();
export const setAuthData = auth.createEvent<string>();

export const $auth = auth.createStore<boolean | string>(false)
    .on(setAuth, (_, value) => value)

export const $userData = auth.createStore<string>('')
    .on(setAuthData, (_, value) => value);    