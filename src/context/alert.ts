import { createDomain } from "effector";

const error = createDomain();

export const setAlert = error.createEvent<{ alertText: string, alertStatus: string }>();

export const $alert = error.createStore({ alertText: '', alertStatus: '' })
    .on(setAlert, (_, value) => value);

