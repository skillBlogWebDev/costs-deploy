import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "effector-react";
import { CostsList } from "./CostsList/CostsList";
import { $costs, setCosts } from '../../context/index'
import { Header } from "./Header/Header";
import { getCostsFx } from "../../api/costsClient";
import { getAuthDataFromLS } from "../../utils/auth";
import { Spinner } from "../Spinner/Spinner";

export const CostsPage = () => {
    const store = useStore($costs);
    const [spinner, setSpinner] = useState(false);
    const shouldLoadCosts = useRef(true);

    useEffect(() => {        
        if (shouldLoadCosts.current) {
            shouldLoadCosts.current = false
            handleGetCosts();
        }
    }, []);    

    const handleGetCosts = async () => {
        setSpinner(true);
        const authData = getAuthDataFromLS();

        const costs = await getCostsFx({
            url: '/cost',
            token: authData.access_token
        });

        setSpinner(false);
        setCosts(costs);
    }

    return (
        <div className='container' style={{ paddingTop: '50px' }}>
            <h1 className='App__title' style={{ textAlign: 'center' }}>Учет моих расходов</h1>
            {useMemo(() => <Header costs={store} />, [store])}
            <div style={{ position: 'relative' }}>
                {spinner && <Spinner top={0} left={0} />}
                {useMemo(() => <CostsList costs={store}/>, [store])}
                {(!spinner && !store.length) && <h2>Список расходов пуст.</h2>}
            </div>
        </div>
    )
}
