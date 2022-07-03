export interface ICostsState {
    costs: ICost[];
    text: string;
    price: number;
}

export interface ICost {
    _id?: number | string;
    text: string;
    price: number;
    date: Date | string;
}

export interface ICreateCostFx {
    url: string;
    cost: ICost;
    token: string;
}

export interface IGetCostsFx {
    url: string;
    token: string;
}

export interface IUpdateCostsFx {
    url: string;
    token: string;
    cost: Partial<ICost>;
    id: string;
}

export interface IDeleteCostsFx {
    url: string;
    token: string;
    id: string
}

export interface IRefreshTokenFx {
    url: string;
    token: string;
    username: string;
}

export interface IHandleAxiosErrorPayload {
    type: string;
    createCost?: Partial<ICreateCostFx>;
    deleteCost?: Partial<IDeleteCostsFx>;
    getCosts?: Partial<IGetCostsFx>;
    updateCosts?: Partial<IUpdateCostsFx>;
}

export interface IAlert {
    alertText: string;
    alertStatus: string
}

export interface IAlertProps {
    props: IAlert;
}

export interface IHeaderProps {
    costs: ICost[];
}

export interface ICostItemProps {
    cost: ICost;
    deleteItem: (arg0: string | number) => void;
    index: number;
}

export interface ISpinnerProps {
    top: number;
    left: number;
}

export interface ICostsListProps {
    costs: ICost[]
}