import React, { MutableRefObject, useRef, useState } from "react";
import { deleteCostsFx, updateCostsFx } from "../../../api/costsClient";
import {formatDate} from "../../../utils/stringUtils";
import { validateInputs } from "../../../utils/validation";
import { getAuthDataFromLS, handleAlertMessage } from '../../../utils/auth';
import { updateCost } from '../../../context/index';
import { ICostItemProps } from "../../../types";
import { Spinner } from "../../Spinner/Spinner";
import './styles.css';

export const CostItem = ({ cost, deleteItem, index }: ICostItemProps) => {
    const [editCost, setEditCost] = useState(false);
    const [newText, setNewText] = useState(cost.text);
    const [newPrice, setNewPrice] = useState<string | number>(cost.price);
    const [newDate, setNewDate] = useState(cost.date);
    const [deleteSpinner, setDeleteSpinner] = useState(false);
    const [editSpinner, setEditSpinner] = useState(false);
    const textInput = useRef() as MutableRefObject<HTMLInputElement>;
    const priceInput = useRef() as MutableRefObject<HTMLInputElement>;
    const dateInput = useRef() as MutableRefObject<HTMLInputElement>;

    const allowCostEdit = () => setEditCost(true);

    const cancelCostEdit = () => {
        setEditSpinner(false);
        setEditCost(false);
        setNewText(cost.text);
        setNewPrice(cost.price);
        setNewDate(cost.date);
    };
    
    const handleChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => setNewPrice(event.target.value)
    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => setNewText(event.target.value)
    const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => setNewDate(event.target.value)

    const handleEditICost = async () => {
        setEditSpinner(true);
        if (
            newText === cost.text && 
            newPrice === cost.price && 
            newDate === cost.date
        ) {
            setEditSpinner(false);
            setEditCost(false);
            return
        }

        if (!validateInputs(
            priceInput,
            textInput,
            dateInput,
        )) {
            return
        }
                
        setEditCost(false);

        const authData = getAuthDataFromLS();

        const updatedCost = await updateCostsFx({
            url: '/cost',
            token: authData.access_token,
            cost:  { text: newText, price: Number(newPrice), date: newDate },
            id: cost._id as string
        })

        if (!updatedCost) {
            setEditSpinner(false);
            return;
        }

        setEditSpinner(false);
        updateCost(updatedCost);
        handleAlertMessage({ alertText: 'Успешно обновлено!', alertStatus: 'success' });
    }

    const deleteCost = async () => {
        setDeleteSpinner(true);
        const authData = getAuthDataFromLS();
        
        await deleteCostsFx({
            url: '/cost',
            token: authData.access_token,
            id: cost._id as string
        });

        setDeleteSpinner(false);
        deleteItem(cost._id as string);
        handleAlertMessage({ alertText: 'Успешно удалено!', alertStatus: 'success' });
    }

    return (
        <li className='cost-item list-group-item d-flex justify-content-between align-items-center' id={cost._id as string}>
            <div className='cost-item__inner'>
                <span className='cost-item__shop'>
                <span> {index} </span>
                    Магазин
                </span> 
                {editCost 
                ? <input 
                    ref={textInput}
                    style={{ width: 'auto', display: 'inline-block' }}
                    onChange={handleChangeText} 
                    className='form-control cost-item__shop-input'
                    value={newText}
                    type='text'
                />
                : <span className='cost__price'> "{cost.text}" </span>}
                {editCost 
                ? <input 
                    ref={dateInput}
                    style={{ width: 'auto', display: 'inline-block' }}
                    onChange={handleChangeDate} 
                    className='form-control cost-item__date-input'
                    value={new Date(newDate).toISOString().split('T')[0]}
                    type='date'
                />
                : <span className='cost__date'>Дата {formatDate(cost.date as string)}</span>}
            </div>
            <div className="cost-item__btn-block d-flex align-items-center">
                {editCost 
                ? <input 
                    ref={priceInput}
                    style={{ width: 'auto', display: 'inline-block' }}
                    onChange={handleChangePrice} 
                    className='form-control cost-item__price-input' 
                    value={newPrice}
                    type='text'
                />
                : <span style={{ marginRight: '10px' }}>Сумма {cost.price} </span>}
                {editCost 
                ? <div className="btn-block__inner">
                    <button 
                        onClick={handleEditICost} 
                        className='btn btn-success btn-block__save'
                    >
                        {editSpinner ? <Spinner top={5} left={38} /> : 'Сохранить'}
                    </button>
                    <button 
                        onClick={cancelCostEdit} 
                        className='btn btn-danger btn-block__cancel'
                    >
                        Отмена
                    </button>
                </div> 
                : <button 
                    onClick={allowCostEdit} 
                    className='btn btn-primary btn-block__edit'
                >
                    Изменить
                </button>}
                <button onClick={deleteCost} className='btn btn-danger btn-delete'>
                    {deleteSpinner ? <Spinner top={5} left={7} /> : <span>&times;</span>}
                </button>
            </div>
        </li>
    )
}
