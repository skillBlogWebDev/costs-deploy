import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useStore } from "effector-react";
import { validateInputs } from '../../../utils/validation';
import { createCostFx } from '../../../api/costsClient';
import { $totalPrice, createCost } from '../../../context/index';
import { countTotalPrice } from "../../../utils/arrayUtils";
import { IHeaderProps } from '../../../types/index';
import { getAuthDataFromLS, handleAlertMessage } from "../../../utils/auth";
import { Spinner } from "../../Spinner/Spinner";
import './styles.css';

export const Header = ({ costs }: IHeaderProps) => {
    const [addSpinner, setAddSpinner] = useState(false);
    const textInput = useRef() as MutableRefObject<HTMLInputElement>;
    const priceInput = useRef() as MutableRefObject<HTMLInputElement>;
    const dateInput = useRef() as MutableRefObject<HTMLInputElement>;
    const totalPrice = useStore($totalPrice);

    useEffect(() => {
        countTotalPrice(costs);
    }, [costs]);

    const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAddSpinner(true);

        const priceInputValue = priceInput.current.value;
        const textInputValue = textInput.current.value;
        const dateInputValue = dateInput.current.value;

        if (!validateInputs(
            priceInput,
            textInput,
            dateInput,
        )) {
            setAddSpinner(false);
            return
        }
        
        const authData = getAuthDataFromLS();

        const cost = await createCostFx({
            url: '/cost',
            cost: {
                text: textInputValue,
                price: parseInt(priceInputValue),
                date: dateInputValue
            },
            token: authData.access_token
        })
        
        if (!cost) {
            setAddSpinner(false);
            return;
        }

        setAddSpinner(false);
        createCost(cost);
        handleAlertMessage({ alertText: 'Успешно создано!', alertStatus: 'success' });
    }

    return (
        <header className='header'>
            <form onSubmit={formSubmit} className='d-flex mb-3'>
                <div className="form-item">
                    <span className='mb-3'>Куда было потрачено:</span>
                    <input ref={textInput} className='form-control' type="text"/>
                </div>
                <div className="form-item">
                    <span className='mb-3'>Сколько было потрачено:</span>
                    <input ref={priceInput} className='form-control' type="text"/>
                </div>
                <div className="form-item">
                    <span className='mb-3'>Когда было потрачено:</span>
                    <input ref={dateInput} className='form-control' type='date' />
                </div>
                <button className='btn btn-primary add-btn'>
                {addSpinner ? <Spinner top={5} left={38} /> : 'Добавить'}
                </button>
            </form>
            <div style={{ textAlign: 'end', marginBottom: '10px' }}>
                Итого:
                <span> {isNaN(parseInt(String(totalPrice))) ? 0 : parseInt(String(totalPrice))} </span>
                р.
            </div>
        </header>
    )
}
